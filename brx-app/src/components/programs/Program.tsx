'use client';

import { useState } from 'react';
import { ProgramHeader } from './ProgramHeader';
import { ProgramSchedule } from './ProgramSchedule';
import { ProgramProgress } from './ProgramProgress';
import { AssignWorkoutModal } from './AssignWorkoutModal';

interface ProgramProps {
  id: string;
}

export function Program({ id }: ProgramProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Mock program data - in a real app, this would be fetched from an API
  const program = {
    id,
    name: 'Strength Foundation',
    description: 'Build fundamental strength with compound movements.',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: 12,
    workoutsCount: 36,
    participantsCount: 245,
    imageUrl: '/programs/strength-foundation.jpg',
    progress: 25,
    schedule: Array.from({ length: 12 }, (_, weekIndex) => ({
      week: weekIndex + 1,
      days: Array.from({ length: 7 }, (_, dayIndex) => ({
        day: dayIndex + 1,
        workout: dayIndex % 2 === 0 ? {
          id: `w${weekIndex + 1}d${dayIndex + 1}`,
          name: `Week ${weekIndex + 1} Day ${dayIndex + 1} Workout`,
          type: 'strength',
          duration: 60,
          completed: weekIndex < 3,
        } : null,
      })),
    })),
  };

  const handleAssignWorkout = (workoutId: string) => {
    if (selectedWeek !== null && selectedDay !== null) {
      console.log('Assigning workout', workoutId, 'to week', selectedWeek, 'day', selectedDay);
      setShowAssignModal(false);
      setSelectedWeek(null);
      setSelectedDay(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgramHeader program={program} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProgramSchedule
              schedule={program.schedule}
              onDayClick={(week, day) => {
                setSelectedWeek(week);
                setSelectedDay(day);
                setShowAssignModal(true);
              }}
            />
          </div>
          
          <div className="space-y-6">
            <ProgramProgress program={program} />
          </div>
        </div>
      </div>
      
      {showAssignModal && (
        <AssignWorkoutModal
          onClose={() => {
            setShowAssignModal(false);
            setSelectedWeek(null);
            setSelectedDay(null);
          }}
          onAssign={handleAssignWorkout}
          week={selectedWeek!}
          day={selectedDay!}
        />
      )}
    </div>
  );
}

