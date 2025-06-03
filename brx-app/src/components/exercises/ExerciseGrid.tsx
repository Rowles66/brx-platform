'use client';

import { ExerciseCard } from './ExerciseCard';

interface ExerciseGridProps {
  filters: {
    category: string;
    equipment: string;
    difficulty: string;
    muscleGroup: string;
  };
  searchQuery: string;
}

export function ExerciseGrid({ filters, searchQuery }: ExerciseGridProps) {
  // In a real app, this would fetch from an API
  const exercises = [
    {
      id: '1',
      name: 'Barbell Squat',
      category: 'Compound',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      muscleGroup: 'Legs',
      description: 'A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.',
      imageUrl: '/exercises/barbell-squat.jpg',
      videoUrl: '/exercises/barbell-squat.mp4',
    },
    {
      id: '2',
      name: 'Bench Press',
      category: 'Compound',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      muscleGroup: 'Chest',
      description: 'A compound upper body exercise that primarily targets the chest, shoulders, and triceps.',
      imageUrl: '/exercises/bench-press.jpg',
      videoUrl: '/exercises/bench-press.mp4',
    },
    {
      id: '3',
      name: 'Deadlift',
      category: 'Compound',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      muscleGroup: 'Back',
      description: 'A compound exercise that targets multiple muscle groups including the back, glutes, and hamstrings.',
      imageUrl: '/exercises/deadlift.jpg',
      videoUrl: '/exercises/deadlift.mp4',
    },
    {
      id: '4',
      name: 'Pull-up',
      category: 'Compound',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      muscleGroup: 'Back',
      description: 'An upper body exercise that targets the back, shoulders, and biceps.',
      imageUrl: '/exercises/pull-up.jpg',
      videoUrl: '/exercises/pull-up.mp4',
    },
    {
      id: '5',
      name: 'Dumbbell Curl',
      category: 'Isolation',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      muscleGroup: 'Arms',
      description: 'An isolation exercise that targets the biceps.',
      imageUrl: '/exercises/dumbbell-curl.jpg',
      videoUrl: '/exercises/dumbbell-curl.mp4',
    },
    {
      id: '6',
      name: 'Leg Press',
      category: 'Compound',
      equipment: 'Machine',
      difficulty: 'Beginner',
      muscleGroup: 'Legs',
      description: 'A compound lower body exercise that primarily targets the quadriceps.',
      imageUrl: '/exercises/leg-press.jpg',
      videoUrl: '/exercises/leg-press.mp4',
    },
  ];

  // Filter exercises based on selected filters and search query
  const filteredExercises = exercises.filter((exercise) => {
    // Skip filtering for 'all' values
    const categoryMatch = filters.category === 'all' || exercise.category === filters.category;
    const equipmentMatch = filters.equipment === 'all' || exercise.equipment === filters.equipment;
    const difficultyMatch = filters.difficulty === 'all' || exercise.difficulty === filters.difficulty;
    const muscleGroupMatch = filters.muscleGroup === 'all' || exercise.muscleGroup === filters.muscleGroup;
    
    // Search query filtering
    const searchMatch = searchQuery === '' || 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && equipmentMatch && difficultyMatch && muscleGroupMatch && searchMatch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {filteredExercises.length > 0 ? (
        filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No exercises found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

