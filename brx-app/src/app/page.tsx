'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Skip authentication and go directly to dashboard
    router.push('/dashboard-replica');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" style={{ borderBottomColor: '#fe3f00' }}></div>
    </div>
  );
}
