'use client';

import Link from 'next/link';

export function ClientOverview() {
  // In a real app, this would fetch data from an API
  const clients = [
    { 
      id: '1', 
      name: 'Jane Smith', 
      status: 'Active',
      lastActive: '2 hours ago',
      plan: 'Strength Building',
      progress: 65
    },
    { 
      id: '2', 
      name: 'Mike Johnson', 
      status: 'Active',
      lastActive: '1 day ago',
      plan: 'Weight Loss',
      progress: 40
    },
    { 
      id: '3', 
      name: 'Sarah Williams', 
      status: 'Inactive',
      lastActive: '2 weeks ago',
      plan: 'Athletic Performance',
      progress: 20
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Client Overview
        </h3>
        <Link
          href="/clients"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all
        </Link>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">Last active: {client.lastActive}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1">{client.progress}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

