'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '~/lib/trpc';
import { ArrowLeft, Calendar, Clock, CheckCircle, Dumbbell } from 'lucide-react';

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState('');
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Temporarily use mock data until we fix the API methods
  const workout = {
    id: id,
    name: 'Sample Workout',
    date: new Date(),
    duration: 45,
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12, weight: null, duration: null },
      { name: 'Squats', sets: 3, reps: 15, weight: null, duration: null },
      { name: 'Bench Press', sets: 3, reps: 10, weight: 135, duration: null }
    ]
  };
  const isLoading = false;
  const error = null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleExercise = (index: number) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedExercises(newCompleted);
  };

  const handleCompleteWorkout = () => {
    if (workout) {
      // Temporarily just navigate back - will implement mutation later
      console.log('Completing workout:', workout.id, 'with notes:', notes);
      router.push('/workouts');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-600">Error loading workout</div>
      </div>
    );
  }

  const isAllCompleted = workout.exercises.length === completedExercises.size;
  const progress = (completedExercises.size / workout.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/workouts">
                <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
                  <ArrowLeft size={20} />
                  <span>Back to Workouts</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workout Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{workout.name}</h1>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{formatDate(workout.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{workout.duration} minutes</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Progress</span>
              <span>{completedExercises.size} of {workout.exercises.length} exercises</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Exercises</h2>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  completedExercises.has(index) 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleExercise(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        completedExercises.has(index)
                          ? 'border-green-500 bg-green-500'
                          : 'border-slate-400'
                      }`}>
                        {completedExercises.has(index) && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                      </div>
                      <h3 className="font-medium text-slate-900">{exercise.name}</h3>
                    </div>
                    <div className="ml-9 mt-2 flex items-center space-x-4 text-sm text-slate-600">
                      <span>{exercise.sets} sets</span>
                      <span>×</span>
                      <span>{exercise.reps} reps</span>
                      {exercise.weight && (
                        <>
                          <Dumbbell size={14} />
                          <span>{exercise.weight} lbs</span>
                        </>
                      )}
                      {exercise.duration && (
                        <>
                          <Clock size={14} />
                          <span>{exercise.duration} seconds</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Workout Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your workout (optional)..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link href="/workouts">
            <button className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleCompleteWorkout}
            disabled={!isAllCompleted}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isAllCompleted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Complete Workout
          </button>
        </div>

        {!isAllCompleted && (
          <p className="text-center text-sm text-slate-600 mt-4">
            Complete all exercises to finish this workout
          </p>
        )}
      </main>
    </div>
  );
} 