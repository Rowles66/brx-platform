'use client';

import Link from 'next/link';
import { trpc } from '~/lib/trpc';
import { ArrowLeft, Calendar, Target, BarChart, CheckCircle } from 'lucide-react';

export default function WorkoutPlansPage() {
  const { data: plans, isLoading, error } = trpc.workout.getWorkoutPlans.useQuery();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getGoalIcon = (goal: string) => {
    switch (goal.toLowerCase()) {
      case 'build strength':
        return <BarChart className="text-purple-500" size={24} />;
      case 'fat loss':
        return <Target className="text-orange-500" size={24} />;
      default:
        return <CheckCircle className="text-blue-500" size={24} />;
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
        <div className="text-red-600">Error loading workout plans</div>
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
              <h1 className="text-2xl font-bold text-slate-900">Workout Plans</h1>
              <p className="text-sm text-slate-600 mt-1">Choose a training program that fits your goals</p>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
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
          {plans?.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {getGoalIcon(plan.goal)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar size={16} className="mr-2" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Target size={16} className="mr-2" />
                    <span>{plan.goal}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <BarChart size={16} className="mr-2" />
                    <span>{plan.daysPerWeek} days per week</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Plan CTA */}
        <div className="mt-12 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Not sure where to start?</h2>
            <p className="text-lg mb-6 opacity-90">
              Take our fitness assessment to get a personalized workout plan recommendation based on your goals, 
              experience level, and available equipment.
            </p>
            <button className="px-6 py-3 bg-white text-sky-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Take Assessment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 