import Link from 'next/link';
import { Logo } from '@/components/scraped/Logo';
import { UserNav } from './UserNav';

export function MainNav() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <Logo maxHeight={40} />
            </Link>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}

