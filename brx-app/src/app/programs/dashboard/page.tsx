'use client';

import { Layout } from '@/components/layout';
import { ActivePrograms } from '@/components/programs/dashboard/ActivePrograms';
import { WeeklySchedule } from '@/components/programs/dashboard/WeeklySchedule';
import { ProgressStats } from '@/components/programs/dashboard/ProgressStats';
import { RecentActivity } from '@/components/programs/dashboard/RecentActivity';

export default function ProgramDashboardPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Programs</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActivePrograms />
            <WeeklySchedule />
            <RecentActivity />
          </div>
          
          <div className="space-y-6">
            <ProgressStats />
          </div>
        </div>
      </div>
    </Layout>
  );
}

