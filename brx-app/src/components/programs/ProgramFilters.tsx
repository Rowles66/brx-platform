'use client';

interface FiltersState {
  category: string;
  difficulty: string;
  duration: string;
}

interface ProgramFiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
}

export function ProgramFilters({ filters, onFilterChange }: ProgramFiltersProps) {
  // Program categories
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Strength', label: 'Strength' },
    { value: 'Hypertrophy', label: 'Hypertrophy' },
    { value: 'Cardio', label: 'Cardio' },
    { value: 'Flexibility', label: 'Flexibility' },
    { value: 'Sport Specific', label: 'Sport Specific' },
  ];

  // Difficulty levels
  const difficultyLevels = [
    { value: 'all', label: 'All Difficulty Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  // Duration options
  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: '4', label: '4 weeks or less' },
    { value: '8', label: '5-8 weeks' },
    { value: '12', label: '9-12 weeks' },
    { value: '13', label: 'More than 12 weeks' },
  ];

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [filterType]: value,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onFilterChange({
      category: 'all',
      difficulty: 'all',
      duration: 'all',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Difficulty
        </label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {difficultyLevels.map((difficulty) => (
            <option key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration
        </label>
        <select
          value={filters.duration}
          onChange={(e) => handleFilterChange('duration', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {durationOptions.map((duration) => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

