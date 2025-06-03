'use client';

import { useState } from 'react';
import Link from 'next/link';

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="ml-3 relative">
      <div>
        <button
          type="button"
          className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="user-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium">JD</span>
          </div>
        </button>
      </div>
      
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1}
        >
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Your Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Settings
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}

