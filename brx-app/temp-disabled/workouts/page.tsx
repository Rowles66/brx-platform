'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '~/lib/trpc';
import { Calendar, Clock, Dumbbell, ChevronRight, Filter, Plus } from 'lucide-react';

export default function WorkoutsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'missed'>('all');

  const { data, isLoading, error } = trpc.workouts.getAll.useQuery({
    limit: 10,
    offset: 0,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'missed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-600">Error loading workouts</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Workouts</h1>
              <p className="text-sm text-slate-600 mt-1">Track and complete your training sessions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/workout-plans">
                <button className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                  <Plus size={16} />
                  <span>Browse Plans</span>
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="text-slate-600 hover:text-slate-900">Back to Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filter by status:</span>
            </div>
            <div className="flex space-x-2">
              {(['all', 'scheduled', 'completed', 'missed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    statusFilter === status
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          {data?.workouts.map((workout) => (
            <Link key={workout.id} href={`/workouts/${workout.id}`}>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <Dumbbell className="text-sky-500" size={24} />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{workout.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-slate-600">
                            <Calendar size={14} />
                            <span>{formatDate(workout.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-slate-600">
                            <Clock size={14} />
                            <span>{workout.duration} min</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workout.status)}`}>
                            {workout.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" size={20} />
                </div>
                
                {/* Exercise Preview */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600">
                    {workout.exercises.length} exercises: {workout.exercises.slice(0, 3).map(e => e.exerciseName).join(', ')}
                    {workout.exercises.length > 3 && '...'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {data?.workouts.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600">No workouts found for the selected filter.</p>
            <Link href="/workout-plans">
              <button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                Browse Workout Plans
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 