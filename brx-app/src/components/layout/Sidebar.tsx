'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'Exercise Library', href: '/exercises', icon: 'DumbbellIcon' },
    { name: 'Workouts', href: '/workouts', icon: 'ClipboardIcon' },
    { name: 'Programs', href: '/programs', icon: 'CalendarIcon' },
    { name: 'Clients', href: '/clients', icon: 'UsersIcon' },
    { name: 'Progress', href: '/progress', icon: 'ChartIcon' },
    { name: 'Settings', href: '/settings', icon: 'CogIcon' },
  ];
  
  return (
    <nav className="w-64 bg-white shadow-sm">
      <div className="h-full px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Add icons later */}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

