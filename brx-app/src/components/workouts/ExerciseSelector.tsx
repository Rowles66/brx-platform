'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  difficulty: string;
  muscleGroup: string;
  description: string;
  imageUrl: string;
}

interface ExerciseSelectorProps {
  onExerciseSelect: (exerciseId: string) => void;
  selectedExercises: string[];
}

export function ExerciseSelector({ onExerciseSelect, selectedExercises }: ExerciseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // In a real app, you would fetch this data from an API
  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Barbell Squat',
      category: 'Compound',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      muscleGroup: 'Legs',
      description: 'A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.',
      imageUrl: '/exercises/barbell-squat.jpg',
    },
    {
      id: '2',
      name: 'Bench Press',
      category: 'Compound',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      muscleGroup: 'Chest',
      description: 'A compound upper body exercise that primarily targets the chest, shoulders, and triceps.',
      imageUrl: '/exercises/bench-press.jpg',
    },
    {
      id: '3',
      name: 'Deadlift',
      category: 'Compound',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      muscleGroup: 'Back',
      description: 'A compound exercise that targets multiple muscle groups including the back, glutes, and hamstrings.',
      imageUrl: '/exercises/deadlift.jpg',
    },
    {
      id: '4',
      name: 'Pull-up',
      category: 'Compound',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      muscleGroup: 'Back',
      description: 'An upper body exercise that targets the back, shoulders, and biceps.',
      imageUrl: '/exercises/pull-up.jpg',
    },
    {
      id: '5',
      name: 'Dumbbell Curl',
      category: 'Isolation',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      muscleGroup: 'Arms',
      description: 'An isolation exercise that targets the biceps.',
      imageUrl: '/exercises/dumbbell-curl.jpg',
    },
  ];

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Add Exercises</h2>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search exercises..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-y-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exercise
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Muscle Group
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExercises.map((exercise) => (
              <tr key={exercise.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        className="rounded-md object-cover"
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                      <div className="text-sm text-gray-500">{exercise.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{exercise.muscleGroup}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{exercise.equipment}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onExerciseSelect(exercise.id)}
                    disabled={selectedExercises.includes(exercise.id)}
                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                      selectedExercises.includes(exercise.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    {selectedExercises.includes(exercise.id) ? 'Added' : 'Add'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredExercises.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No exercises found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

