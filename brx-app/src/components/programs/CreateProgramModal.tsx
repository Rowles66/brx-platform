'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ProgramData {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
}

interface CreateProgramModalProps {
  onClose: () => void;
  onSave: (program: ProgramData) => void;
}

export function CreateProgramModal({ onClose, onSave }: CreateProgramModalProps) {
  const [program, setProgram] = useState<ProgramData>({
    name: '',
    description: '',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: 8,
  });

  const handleChange = (field: keyof ProgramData, value: string | number) => {
    setProgram(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(program);
  };

  // Program categories
  const categories = [
    { value: 'Strength', label: 'Strength' },
    { value: 'Hypertrophy', label: 'Hypertrophy' },
    { value: 'Cardio', label: 'Cardio' },
    { value: 'Flexibility', label: 'Flexibility' },
    { value: 'Sport Specific', label: 'Sport Specific' },
  ];

  // Difficulty levels
  const difficultyLevels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">Create New Program</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name *
              </label>
              <input
                type="text"
                value={program.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter program name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={program.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Describe the program"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={program.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty *
              </label>
              <select
                value={program.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {difficultyLevels.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (weeks) *
              </label>
              <input
                type="number"
                value={program.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 1)}
                required
                min="1"
                max="52"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={!program.name || !program.description}
            >
              Create Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

