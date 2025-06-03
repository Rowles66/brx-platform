'use client';

import Link from 'next/link';
import { ArrowLeft, TrendingUp, Activity, Target, Award, Calendar } from 'lucide-react';

export default function ProgressPage() {
  // Mock data for progress tracking
  const stats = {
    totalWorkouts: 47,
    currentStreak: 7,
    personalRecords: 12,
    goalsCompleted: 3,
  };

  const weeklyProgress = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: false },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ];

  const personalRecords = [
    { exercise: 'Bench Press', weight: 225, unit: 'lbs', date: '2025-05-28' },
    { exercise: 'Squat', weight: 315, unit: 'lbs', date: '2025-05-25' },
    { exercise: 'Deadlift', weight: 405, unit: 'lbs', date: '2025-05-20' },
    { exercise: 'Mile Run', weight: 6.5, unit: 'min', date: '2025-05-15' },
  ];

  const monthlyWorkouts = [
    { month: 'Jan', count: 16 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 22 },
    { month: 'Apr', count: 20 },
    { month: 'May', count: 19 },
  ];

  const maxWorkouts = Math.max(...monthlyWorkouts.map(m => m.count));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor your fitness journey and achievements</p>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600">
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalWorkouts}</p>
              </div>
              <Activity className="text-orange-500" size={32} style={{ color: '#fe3f00' }} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.currentStreak} days</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Personal Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.personalRecords}</p>
              </div>
              <Award className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goals Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.goalsCompleted}</p>
              </div>
              <Target className="text-orange-500" size={32} style={{ color: '#db3204' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
            <div className="flex justify-between items-end space-x-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className={`h-20 w-full rounded-t-lg`}
                    style={{ backgroundColor: day.completed ? '#fe3f00' : '#e5e7eb' }}
                  />
                  <p className="text-xs text-gray-600 mt-2">{day.day}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium text-gray-900">
                {Math.round((weeklyProgress.filter(d => d.completed).length / weeklyProgress.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Monthly Workouts Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Workouts</h2>
            <div className="space-y-3">
              {monthlyWorkouts.map((month, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-12">{month.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div
                      className="h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ 
                        width: `${(month.count / maxWorkouts) * 100}%`,
                        backgroundColor: '#fe3f00'
                      }}
                    >
                      <span className="text-xs text-white font-medium">{month.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Records */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Personal Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{record.exercise}</p>
                  <p className="text-sm text-gray-600">{record.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {record.weight}
                    <span className="text-sm font-normal text-gray-600 ml-1">{record.unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6 rounded-xl p-8 text-white" style={{ background: 'linear-gradient(to right, #fe3f00, #db3204)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Keep up the great work!</h2>
              <p className="opacity-90">You're on a 7-day streak. Just 3 more days to unlock the "Dedicated Athlete" badge!</p>
            </div>
            <Award size={64} className="text-white/20" />
          </div>
        </div>
      </main>
    </div>
  );
} 