'use client';

import { TrendingUp, Calendar, Dumbbell } from 'lucide-react';

interface ProgramProgressProps {
  program: {
    progress: number;
    duration: number;
  };
}

export function ProgramProgress({ program }: ProgramProgressProps) {
  // Calculate weeks completed based on progress percentage
  const weeksCompleted = Math.floor((program.progress / 100) * program.duration);
  
  // Calculate workouts completed (mock data)
  const totalWorkouts = program.duration * 3; // Assume 3 workouts per week
  const workoutsCompleted = Math.floor((program.progress / 100) * totalWorkouts);

  // Stats to display
  const stats = [
    {
      name: 'Weeks Completed',
      value: `${weeksCompleted} of ${program.duration}`,
      icon: <Calendar className="h-5 w-5 text-indigo-500" />,
    },
    {
      name: 'Workouts Completed',
      value: `${workoutsCompleted} of ${totalWorkouts}`,
      icon: <Dumbbell className="h-5 w-5 text-indigo-500" />,
    },
    {
      name: 'Current Streak',
      value: '5 days',
      icon: <TrendingUp className="h-5 w-5 text-indigo-500" />,
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Your Progress</h2>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Overall Progress</span>
          <span className="font-medium">{program.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${program.progress}%` }}
          />
        </div>
        
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center">
              <div className="p-2 rounded-md bg-indigo-50">
                {stat.icon}
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-500">{stat.name}</div>
                <div className="font-medium">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            View Detailed Stats
          </button>
        </div>
      </div>
    </div>
  );
}

