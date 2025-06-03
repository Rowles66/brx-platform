'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, CheckCircle } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  completed: boolean;
}

interface Day {
  day: number;
  workout: Workout | null;
}

interface Week {
  week: number;
  days: Day[];
}

interface ProgramScheduleProps {
  schedule: Week[];
  onDayClick: (week: number, day: number) => void;
}

export function ProgramSchedule({ schedule, onDayClick }: ProgramScheduleProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]); // Default: Week 1 expanded

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Training Schedule</h2>
      </div>

      <div className="divide-y">
        {schedule.map((week) => (
          <div key={week.week} className="flex flex-col">
            <button
              onClick={() => toggleWeek(week.week)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 w-full text-left"
            >
              <div className="flex items-center">
                <span className="font-medium">Week {week.week}</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {week.days.filter(day => day.workout !== null).length} workouts
                </span>
              </div>
              {expandedWeeks.includes(week.week) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedWeeks.includes(week.week) && (
              <div className="px-4 pb-4 pt-2 space-y-2">
                {week.days.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center border rounded-md p-3 hover:border-indigo-300 cursor-pointer"
                    onClick={() => onDayClick(week.week, day.day)}
                  >
                    <div className="w-1/4 font-medium">{dayNames[day.day - 1]}</div>
                    {day.workout ? (
                      <div className="flex-grow flex items-center justify-between">
                        <div>
                          <div className="font-medium">{day.workout.name}</div>
                          <div className="text-sm text-gray-500">
                            {day.workout.type} • {day.workout.duration} min
                          </div>
                        </div>
                        {day.workout.completed ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm">Completed</span>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">Not completed</div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-grow flex items-center justify-center text-gray-400">
                        <Plus className="h-5 w-5 mr-2" />
                        <span>Assign workout</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

