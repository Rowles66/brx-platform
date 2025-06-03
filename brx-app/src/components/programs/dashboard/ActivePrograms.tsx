'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

export function ActivePrograms() {
  // Mock data - in a real app, this would come from an API
  const programs = [
    {
      id: '1',
      name: 'Strength Foundation',
      progress: 25,
      nextWorkout: {
        name: 'Upper Body Strength',
        scheduled: 'Today, 2:00 PM',
      },
      imageUrl: '/programs/strength-foundation.jpg',
    },
    {
      id: '2',
      name: 'HIIT & Conditioning',
      progress: 45,
      nextWorkout: {
        name: 'HIIT Circuit',
        scheduled: 'Tomorrow, 10:00 AM',
      },
      imageUrl: '/programs/hiit.jpg',
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Active Programs</h2>
        <Link
          href="/programs"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Browse All Programs
        </Link>
      </div>

      <div className="divide-y">
        {programs.map((program) => (
          <div key={program.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={program.imageUrl}
                  alt={program.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              
              <div className="flex-grow">
                <Link
                  href={`/programs/${program.id}`}
                  className="text-lg font-medium hover:text-indigo-600"
                >
                  {program.name}
                </Link>
                
                <div className="mt-2">
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
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Next: {program.nextWorkout.name} • {program.nextWorkout.scheduled}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <Link
          href="/programs"
          className="block w-full py-2 px-4 text-center text-indigo-600 hover:bg-indigo-50 rounded-md"
        >
          Start New Program
        </Link>
      </div>
    </div>
  );
}

