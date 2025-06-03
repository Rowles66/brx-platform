'use client';

import Image from 'next/image';
import { Calendar, Users, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProgramHeaderProps {
  program: {
    name: string;
    description: string;
    imageUrl: string;
    difficulty: string;
    duration: number;
    workoutsCount: number;
    participantsCount: number;
  };
}

export function ProgramHeader({ program }: ProgramHeaderProps) {
  return (
    <div className="relative">
      <div className="h-64 w-full relative">
        <Image
          src={program.imageUrl}
          alt={program.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      <div className="absolute top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/programs"
            className="inline-flex items-center text-white hover:text-gray-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Programs
          </Link>
          
          <div className="mt-8">
            <h1 className="text-4xl font-bold text-white">{program.name}</h1>
            <p className="mt-2 text-lg text-gray-200">{program.description}</p>
            
            <div className="mt-6 flex items-center space-x-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                program.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                program.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {program.difficulty}
              </span>
              
              <div className="flex items-center text-white">
                <Calendar className="h-5 w-5 mr-2" />
                {program.duration} weeks
              </div>
              
              <div className="flex items-center text-white">
                <Clock className="h-5 w-5 mr-2" />
                {program.workoutsCount} workouts
              </div>
              
              <div className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2" />
                {program.participantsCount} participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

