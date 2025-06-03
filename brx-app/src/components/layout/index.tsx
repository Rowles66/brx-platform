'use client';

import { MainNav } from './MainNav';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <MainNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

