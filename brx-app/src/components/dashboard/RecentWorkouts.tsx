'use client';

import Link from 'next/link';

export function RecentWorkouts() {
  // In a real app, this would fetch data from an API
  const workouts = [
    { id: '1', name: 'Upper Body Strength', date: 'May 28, 2025', completed: true },
    { id: '2', name: 'HIIT Cardio', date: 'May 26, 2025', completed: true },
    { id: '3', name: 'Lower Body Focus', date: 'May 24, 2025', completed: true },
    { id: '4', name: 'Full Body Workout', date: 'May 21, 2025', completed: true },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Recent Workouts
        </h3>
        <Link
          href="/workouts"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {workouts.map((workout) => (
            <li key={workout.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {workout.name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {workout.date}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

