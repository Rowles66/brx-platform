'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  type: string;
  equipment: string[];
  duration: number;
}

interface AssignWorkoutModalProps {
  onClose: () => void;
  onAssign: (workoutId: string) => void;
  week: number;
  day: number;
}

export function AssignWorkoutModal({ onClose, onAssign, week, day }: AssignWorkoutModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock workouts data - in a real app, this would come from an API
  const workouts: Workout[] = [
    {
      id: 'w1',
      name: 'Full Body Strength',
      type: 'Strength',
      equipment: ['Barbell', 'Dumbbells'],
      duration: 60,
    },
    {
      id: 'w2',
      name: 'Upper Body Focus',
      type: 'Strength',
      equipment: ['Dumbbells', 'Cables'],
      duration: 45,
    },
    {
      id: 'w3',
      name: 'Lower Body Power',
      type: 'Strength',
      equipment: ['Barbell', 'Kettlebells'],
      duration: 50,
    },
    {
      id: 'w4',
      name: 'HIIT Cardio',
      type: 'Cardio',
      equipment: ['Bodyweight'],
      duration: 30,
    },
    {
      id: 'w5',
      name: 'Mobility & Recovery',
      type: 'Recovery',
      equipment: ['Foam Roller', 'Resistance Bands'],
      duration: 40,
    },
  ];
  
  // Filter workouts based on search query
  const filteredWorkouts = workouts.filter(workout => 
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.equipment.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get day name
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayName = dayNames[day - 1];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">Assign Workout</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <h3 className="font-medium">Week {week}, {dayName}</h3>
          <p className="text-sm text-gray-500 mt-1">Select a workout to assign to this day.</p>
          
          <div className="relative mt-3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workouts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          <div className="p-2">
            {filteredWorkouts.length > 0 ? (
              <div className="space-y-2">
                {filteredWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="p-3 border rounded-md hover:border-indigo-300 cursor-pointer"
                    onClick={() => onAssign(workout.id)}
                  >
                    <h4 className="font-medium">{workout.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-sm text-gray-500">
                        {workout.type} • {workout.duration} min
                      </div>
                      <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {workout.equipment.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No workouts found matching your search.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {}}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create New Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

