'use client';

import Link from 'next/link';
import { trpc } from '~/lib/trpc';
import { ArrowLeft, Calendar, Target, BarChart, CheckCircle } from 'lucide-react';

export default function WorkoutPlansPage() {
  const { data: workoutsData, isLoading, error } = trpc.workouts.getAll.useQuery({
    limit: 10,
    offset: 0
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'planned':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" style={{ borderBottomColor: '#fe3f00' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-600">Error loading workout plans</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workout Plans</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your training programs</p>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutsData?.workouts?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workout plans</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first workout plan.</p>
              <div className="mt-6">
                <Link href="/workouts/builder">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white" style={{ backgroundColor: '#fe3f00' }}>
                    <Target className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create Workout Plan
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            workoutsData?.workouts?.map((workout) => (
              <div
                key={workout.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Target className="h-8 w-8 text-orange-500" style={{ color: '#fe3f00' }} />
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workout.status)}`}>
                      {workout.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{workout.name}</h3>
                  {workout.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workout.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      <span>Created: {formatDate(workout.createdAt)}</span>
                    </div>
                    {workout.scheduledAt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-2" />
                        <span>Scheduled: {formatDate(workout.scheduledAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <BarChart size={14} className="mr-2" />
                      <span>{workout.exercises?.length || 0} exercises</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link href={`/workouts/${workout.id}`}>
                      <button className="text-sm font-medium hover:underline" style={{ color: '#fe3f00' }}>
                        View Details
                      </button>
                    </Link>
                    {workout.status === 'COMPLETED' && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}