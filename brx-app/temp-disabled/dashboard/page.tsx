'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Activity, TrendingUp, User, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  // Mock user data for now since we're removing authentication
  const [user] = useState({ name: 'Test User' });

  const handleSignOut = () => {
    // Just redirect to login page for now
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://cdn.exercise.com/images/1154147/6f7da32581c89ca25d665dc3aae533e4f14fe3ef_original.svg" 
                alt="BRX Performance" 
                className="h-10"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/workouts">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-orange-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Workout</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">Upper Body</p>
                </div>
                <Activity className="text-orange-500" size={32} style={{ color: '#fe3f00' }} />
              </div>
            </div>
          </Link>

          <Link href="/schedule">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-orange-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Session</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">Tomorrow</p>
                </div>
                <Calendar className="text-orange-500" size={32} style={{ color: '#fe3f00' }} />
              </div>
            </div>
          </Link>

          <Link href="/progress">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-orange-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">4 Workouts</p>
                </div>
                <TrendingUp className="text-orange-500" size={32} style={{ color: '#fe3f00' }} />
              </div>
            </div>
          </Link>

          <Link href="/profile">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-orange-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profile</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">Complete</p>
                </div>
                <User className="text-orange-500" size={32} style={{ color: '#fe3f00' }} />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Completed Lower Body Workout</p>
                <p className="text-sm text-gray-600">2 days ago • 45 minutes</p>
              </div>
              <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">Completed</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Updated Profile Information</p>
                <p className="text-sm text-gray-600">3 days ago</p>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#fff5f0', color: '#fe3f00' }}>Profile</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Completed Cardio Session</p>
                <p className="text-sm text-gray-600">1 week ago • 30 minutes</p>
              </div>
              <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">Completed</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

