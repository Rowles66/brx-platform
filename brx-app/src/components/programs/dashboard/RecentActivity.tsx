'use client';

import { CheckCircle, TrendingUp, Award, Calendar, ArrowUp } from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'workout' | 'achievement' | 'milestone' | 'program';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: React.ReactNode;
  link?: {
    url: string;
    text: string;
  };
}

export function RecentActivity() {
  // Mock data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: 'a1',
      type: 'workout',
      title: 'Completed Upper Body Strength',
      subtitle: 'Strength Foundation program',
      timestamp: 'Today, 2:15 PM',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      link: {
        url: '/programs/1',
        text: 'View Program',
      },
    },
    {
      id: 'a2',
      type: 'achievement',
      title: 'Earned New Achievement',
      subtitle: 'Consistent Performer',
      timestamp: 'Yesterday, 6:30 PM',
      icon: <Award className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: 'a3',
      type: 'milestone',
      title: 'New Personal Record',
      subtitle: 'Barbell Squat: 225 lbs',
      timestamp: '3 days ago',
      icon: <TrendingUp className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: 'a4',
      type: 'program',
      title: 'Started New Program',
      subtitle: 'HIIT & Conditioning',
      timestamp: '1 week ago',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      link: {
        url: '/programs/2',
        text: 'View Program',
      },
    },
  ];

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'workout':
        return 'bg-green-100';
      case 'achievement':
        return 'bg-yellow-100';
      case 'milestone':
        return 'bg-indigo-100';
      case 'program':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Recent Activity</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-500">
          View All
        </button>
      </div>

      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4">
            <div className="flex items-start">
              <div className={`p-2 rounded-full ${getActivityBg(activity.type)} mr-4`}>
                {activity.icon}
              </div>
              
              <div className="flex-grow">
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.subtitle}</div>
                <div className="text-xs text-gray-400 mt-1">{activity.timestamp}</div>
                
                {activity.link && (
                  <Link
                    href={activity.link.url}
                    className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {activity.link.text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <button className="flex items-center justify-center w-full py-2 px-4 text-center text-indigo-600 hover:bg-indigo-50 rounded-md">
          <ArrowUp className="h-4 w-4 mr-1" />
          Load More
        </button>
      </div>
    </div>
  );
}

