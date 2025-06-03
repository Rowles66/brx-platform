'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Clock } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number; // in weeks
  workoutsCount: number;
  participantsCount: number;
  imageUrl: string;
  progress?: number;
}

interface ProgramsListProps {
  filters: {
    category: string;
    difficulty: string;
    duration: string;
  };
}

export function ProgramsList({ filters }: ProgramsListProps) {
  // Mock data - in a real app, this would come from an API
  const programs: Program[] = [
    {
      id: '1',
      name: 'Strength Foundation',
      description: 'Build fundamental strength with compound movements.',
      category: 'Strength',
      difficulty: 'Intermediate',
      duration: 12,
      workoutsCount: 36,
      participantsCount: 245,
      imageUrl: '/programs/strength-foundation.jpg',
      progress: 25,
    },
    {
      id: '2',
      name: 'HIIT & Conditioning',
      description: 'High-intensity interval training for improved conditioning.',
      category: 'Cardio',
      difficulty: 'Advanced',
      duration: 8,
      workoutsCount: 24,
      participantsCount: 189,
      imageUrl: '/programs/hiit.jpg',
      progress: 0,
    },
    {
      id: '3',
      name: 'Mobility Master',
      description: 'Improve your flexibility, mobility, and recovery.',
      category: 'Flexibility',
      difficulty: 'Beginner',
      duration: 4,
      workoutsCount: 12,
      participantsCount: 120,
      imageUrl: '/programs/mobility.jpg',
      progress: 75,
    },
    {
      id: '4',
      name: 'Powerlifting Pro',
      description: 'Advanced strength training for serious lifters.',
      category: 'Strength',
      difficulty: 'Advanced',
      duration: 16,
      workoutsCount: 48,
      participantsCount: 87,
      imageUrl: '/programs/powerlifting.jpg',
    }
  ];

  // Filter programs based on selected filters
  const filteredPrograms = programs.filter(program => {
    if (filters.category !== 'all' && program.category !== filters.category) return false;
    if (filters.difficulty !== 'all' && program.difficulty !== filters.difficulty) return false;
    if (filters.duration !== 'all') {
      const durationWeeks = parseInt(filters.duration);
      if (durationWeeks === 4 && program.duration > 4) return false;
      if (durationWeeks === 8 && (program.duration < 5 || program.duration > 8)) return false;
      if (durationWeeks === 12 && (program.duration < 9 || program.duration > 12)) return false;
      if (durationWeeks === 13 && program.duration <= 12) return false;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredPrograms.map((program) => (
        <Link
          key={program.id}
          href={`/programs/${program.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="relative h-48">
            <Image
              src={program.imageUrl}
              alt={program.name}
              fill
              className="rounded-t-lg object-cover"
            />
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{program.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                program.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                program.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {program.difficulty}
              </span>
            </div>
            
            <p className="mt-2 text-sm text-gray-600">{program.description}</p>
            
            {program.progress !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{program.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {program.duration} weeks
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                {program.workoutsCount} workouts
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                {program.participantsCount}
              </div>
            </div>
          </div>
        </Link>
      ))}

      {filteredPrograms.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-lg">No programs found matching your criteria.</p>
          <p className="mt-2">Try adjusting your filters or create a new program.</p>
        </div>
      )}
    </div>
  );
}

