'use client';

export function DashboardStats() {
  // In a real app, this would fetch data from an API
  const stats = [
    { name: 'Total Workouts', value: '24' },
    { name: 'Active Programs', value: '3' },
    { name: 'Exercise Library', value: '248' },
    { name: 'Active Clients', value: '15' },
  ];

  return (
    <>
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stat.value}
            </dd>
          </div>
        </div>
      ))}
    </>
  );
}

