'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { ExerciseGrid } from '@/components/exercises/ExerciseGrid';
import { ExerciseFilters } from '@/components/exercises/ExerciseFilters';
import { ExerciseSearch } from '@/components/exercises/ExerciseSearch';

export default function ExerciseLibraryPage() {
  const [filters, setFilters] = useState({
    category: 'all',
    equipment: 'all',
    difficulty: 'all',
    muscleGroup: 'all',
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Exercise Library</h1>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Exercise
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ExerciseFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ExerciseSearch
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <ExerciseGrid
              filters={filters}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

