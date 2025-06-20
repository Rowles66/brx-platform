'use client';

import { Search } from 'lucide-react';

interface ExerciseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExerciseSearch({ value, onChange }: ExerciseSearchProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search exercises by name or description..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <span className="text-sm">Clear</span>
        </button>
      )}
    </div>
  );
}

