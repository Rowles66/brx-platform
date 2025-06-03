'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  difficulty: string;
  muscleGroup: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={exercise.imageUrl}
          alt={exercise.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium">{exercise.name}</h3>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-500">Category:</span>
            <span className="ml-2">{exercise.category}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-500">Equipment:</span>
            <span className="ml-2">{exercise.equipment}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-500">Muscle Group:</span>
            <span className="ml-2">{exercise.muscleGroup}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`/exercises/${exercise.id}`}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            View Details
          </Link>
          <span className={`px-2 py-1 text-xs rounded-full ${
            exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
            exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

