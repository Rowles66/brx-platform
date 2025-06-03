'use client';

import { Activity, TrendingUp, Calendar, Dumbbell, Medal, Target } from 'lucide-react';

export function ProgressStats() {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalWorkouts: 42,
    completedWorkouts: 28,
    totalTime: 1680, // minutes
    streak: 5,
    achievements: 8,
    consistency: 87, // percentage
  };
  
  const completionRate = Math.round((stats.completedWorkouts / stats.totalWorkouts) * 100);
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours} hrs ${minutes % 60} min`;
  };

  // Recent achievements
  const achievements = [
    { name: 'Consistent Performer', description: 'Complete workouts on schedule for 4 weeks', icon: <Calendar className="h-5 w-5 text-indigo-500" /> },
    { name: 'Strength Milestone', description: 'Reached strength goal on key lifts', icon: <Dumbbell className="h-5 w-5 text-indigo-500" /> },
    { name: 'Half Century', description: 'Completed 50 workouts total', icon: <Medal className="h-5 w-5 text-indigo-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Overall Progress</h2>
        </div>
        
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="text-center border rounded-lg p-3">
            <Activity className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Completion Rate</div>
            <div className="text-xl font-bold">{completionRate}%</div>
          </div>
          
          <div className="text-center border rounded-lg p-3">
            <Dumbbell className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Workouts</div>
            <div className="text-xl font-bold">{stats.completedWorkouts}/{stats.totalWorkouts}</div>
          </div>
          
          <div className="text-center border rounded-lg p-3">
            <TrendingUp className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Current Streak</div>
            <div className="text-xl font-bold">{stats.streak} days</div>
          </div>
          
          <div className="text-center border rounded-lg p-3">
            <Target className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Total Training Time</div>
            <div className="text-xl font-bold">{formatTime(stats.totalTime)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Recent Achievements</h2>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md">{stats.achievements} total</span>
        </div>
        
        <div className="divide-y">
          {achievements.map((achievement, index) => (
            <div key={index} className="p-4 flex items-start">
              <div className="p-2 rounded-md bg-indigo-50 mr-4">
                {achievement.icon}
              </div>
              <div>
                <div className="font-medium">{achievement.name}</div>
                <div className="text-sm text-gray-500">{achievement.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <button className="block w-full py-2 px-4 text-center text-indigo-600 hover:bg-indigo-50 rounded-md">
            View All Achievements
          </button>
        </div>
      </div>
    </div>
  );
}

