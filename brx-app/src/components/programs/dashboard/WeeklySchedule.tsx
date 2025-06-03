'use client';

import { useState } from 'react';
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface WorkoutSchedule {
  id: string;
  name: string;
  time: string;
  duration: number;
  completed: boolean;
  programName: string;
  programId: string;
}

export function WeeklySchedule() {
  const [currentWeek, setCurrentWeek] = useState<number>(0); // 0 = current week
  
  // Get dates for the current week
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(today);
  monday.setDate(diff + (currentWeek * 7));
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  // Format date as "Mon 12"
  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Mock data - in a real app, this would come from an API
  const schedule: Record<string, WorkoutSchedule[]> = {
    'Mon 10': [
      {
        id: 'w1',
        name: 'Upper Body Strength',
        time: '2:00 PM',
        duration: 60,
        completed: true,
        programName: 'Strength Foundation',
        programId: '1',
      }
    ],
    'Wed 12': [
      {
        id: 'w2',
        name: 'Lower Body Power',
        time: '6:30 AM',
        duration: 45,
        completed: false,
        programName: 'Strength Foundation',
        programId: '1',
      }
    ],
    'Fri 14': [
      {
        id: 'w3',
        name: 'HIIT Circuit',
        time: '10:00 AM',
        duration: 30,
        completed: false,
        programName: 'HIIT & Conditioning',
        programId: '2',
      }
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Workout Schedule</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentWeek(prev => prev - 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={() => setCurrentWeek(0)}
            className={`px-3 py-1 text-sm rounded-md ${
              currentWeek === 0 ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setCurrentWeek(prev => prev + 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="divide-y">
        {weekDays.map((date, index) => {
          const dateStr = formatDate(date);
          const workouts = schedule[dateStr] || [];
          const isPast = date < new Date() && !isToday(date);
          
          return (
            <div key={index} className={`p-4 ${isToday(date) ? 'bg-indigo-50' : ''}`}>
              <div className="flex items-center mb-2">
                <div className={`font-medium ${isToday(date) ? 'text-indigo-700' : ''}`}>
                  {dateStr}
                  {isToday(date) && <span className="ml-2 text-xs text-indigo-600 font-normal">Today</span>}
                </div>
              </div>

              {workouts.length > 0 ? (
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div 
                      key={workout.id}
                      className="flex items-center border rounded-md p-3 hover:border-indigo-300 cursor-pointer"
                    >
                      <div className="flex-grow">
                        <div className="font-medium">{workout.name}</div>
                        <div className="text-sm text-gray-500">
                          From: <Link href={`/programs/${workout.programId}`} className="text-indigo-600 hover:underline">{workout.programName}</Link>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {workout.time} • {workout.duration} min
                        </div>
                        {workout.completed ? (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </div>
                        ) : (
                          <button className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200">
                            {isPast ? 'Mark Complete' : 'Start Workout'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-sm text-gray-500">
                  No workouts scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

