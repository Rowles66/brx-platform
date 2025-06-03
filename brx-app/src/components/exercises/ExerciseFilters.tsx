'use client';

interface FiltersState {
  category: string;
  equipment: string;
  difficulty: string;
  muscleGroup: string;
}

interface ExerciseFiltersProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
}

export function ExerciseFilters({ filters, onFilterChange }: ExerciseFiltersProps) {
  // Categories
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Compound', label: 'Compound' },
    { value: 'Isolation', label: 'Isolation' },
    { value: 'Functional', label: 'Functional' },
    { value: 'Plyometric', label: 'Plyometric' },
  ];

  // Equipment types
  const equipmentTypes = [
    { value: 'all', label: 'All Equipment' },
    { value: 'Bodyweight', label: 'Bodyweight' },
    { value: 'Barbell', label: 'Barbell' },
    { value: 'Dumbbell', label: 'Dumbbell' },
    { value: 'Machine', label: 'Machine' },
    { value: 'Kettlebell', label: 'Kettlebell' },
    { value: 'Resistance Band', label: 'Resistance Band' },
    { value: 'Cable', label: 'Cable' },
  ];

  // Difficulty levels
  const difficultyLevels = [
    { value: 'all', label: 'All Difficulty Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  // Muscle groups
  const muscleGroups = [
    { value: 'all', label: 'All Muscle Groups' },
    { value: 'Chest', label: 'Chest' },
    { value: 'Back', label: 'Back' },
    { value: 'Legs', label: 'Legs' },
    { value: 'Arms', label: 'Arms' },
    { value: 'Shoulders', label: 'Shoulders' },
    { value: 'Core', label: 'Core' },
    { value: 'Full Body', label: 'Full Body' },
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
      equipment: 'all',
      difficulty: 'all',
      muscleGroup: 'all',
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

      {/* Equipment Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Equipment
        </label>
        <select
          value={filters.equipment}
          onChange={(e) => handleFilterChange('equipment', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {equipmentTypes.map((equipment) => (
            <option key={equipment.value} value={equipment.value}>
              {equipment.label}
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

      {/* Muscle Group Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Muscle Group
        </label>
        <select
          value={filters.muscleGroup}
          onChange={(e) => handleFilterChange('muscleGroup', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {muscleGroups.map((muscleGroup) => (
            <option key={muscleGroup.value} value={muscleGroup.value}>
              {muscleGroup.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

