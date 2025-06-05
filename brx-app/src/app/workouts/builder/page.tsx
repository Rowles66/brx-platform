'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Save } from 'lucide-react';

export default function WorkoutBuilderPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState({
    name: '',
    description: '',
    exercises: []
  });

  const handleSaveWorkout = () => {
    // Simplified save logic for now
    console.log('Saving workout:', workout);
    router.push('/workouts');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/workouts">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={20} />
                  <span>Back to Workouts</span>
                </button>
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Workout Builder</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Build Your Workout</h2>
          
          {/* Workout Details Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                id="workout-name"
                value={workout.name}
                onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter workout name..."
                style={{ borderColor: workout.name ? '#fe3f00' : '' }}
              />
            </div>
            
            <div>
              <label htmlFor="workout-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="workout-description"
                value={workout.description}
                onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                placeholder="Describe your workout..."
              />
            </div>

            {/* Exercise List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">Exercises</h3>
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                        style={{ backgroundColor: '#fe3f00' }}>
                  <Plus size={16} />
                  <span>Add Exercise</span>
                </button>
              </div>
              
              {workout.exercises.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No exercises added yet.</p>
                  <p className="text-sm">Click "Add Exercise" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Exercise list would go here */}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveWorkout}
                disabled={!workout.name}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  workout.name
                    ? 'text-white hover:opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ backgroundColor: workout.name ? '#fe3f00' : '' }}
              >
                <Save size={16} />
                <span>Save Workout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}