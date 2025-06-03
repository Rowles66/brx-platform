'use client';

import Link from 'next/link';

export function UpcomingPrograms() {
  // In a real app, this would fetch data from an API
  const programs = [
    { 
      id: '1', 
      name: 'Summer Strength Program', 
      progress: 45,
      nextWorkout: 'Upper Body Strength',
      nextWorkoutDate: 'Tomorrow'
    },
    { 
      id: '2', 
      name: 'Endurance Builder', 
      progress: 70,
      nextWorkout: 'Long Distance Run',
      nextWorkoutDate: 'Thursday'
    },
    { 
      id: '3', 
      name: 'Mobility & Recovery', 
      progress: 20,
      nextWorkout: 'Foam Rolling Session',
      nextWorkoutDate: 'Friday'
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Active Programs
        </h3>
        <Link
          href="/programs"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {programs.map((program) => (
            <li key={program.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {program.name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {program.progress}% Complete
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Next: {program.nextWorkout} ({program.nextWorkoutDate})
                    </p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${program.progress}%` }}
                  ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

