'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { ProgramsList } from '@/components/programs/ProgramsList';
import { ProgramFilters } from '@/components/programs/ProgramFilters';
import { CreateProgramModal } from '@/components/programs/CreateProgramModal';

export default function ProgramsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    duration: 'all',
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Training Programs</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Program
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProgramFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ProgramsList filters={filters} />
          </div>
        </div>

        {showCreateModal && (
          <CreateProgramModal
            onClose={() => setShowCreateModal(false)}
            onSave={(program) => {
              console.log('Create program:', program);
              setShowCreateModal(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

