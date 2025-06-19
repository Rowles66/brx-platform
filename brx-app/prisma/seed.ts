import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'password', // In production, this should be hashed
      rememberMe: false,
    },
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create sample exercises
  const exercises = await Promise.all([
    prisma.exercise.upsert({
      where: { id: 'exercise-1' },
      update: {},
      create: {
        id: 'exercise-1',
        name: 'Push-ups',
        description: 'Classic bodyweight upper body exercise',
        category: 'Strength',
        difficulty: 'Beginner',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: 'None',
        instructions: '1. Start in plank position\n2. Lower body to ground\n3. Push back up',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'exercise-2' },
      update: {},
      create: {
        id: 'exercise-2',
        name: 'Squats',
        description: 'Fundamental lower body compound movement',
        category: 'Strength',
        difficulty: 'Beginner',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: 'None',
        instructions: '1. Stand with feet shoulder-width apart\n2. Lower hips back and down\n3. Return to standing',
      },
    }),
    prisma.exercise.upsert({
      where: { id: 'exercise-3' },
      update: {},
      create: {
        id: 'exercise-3',
        name: 'Deadlift',
        description: 'Hip hinge movement pattern with barbell',
        category: 'Strength',
        difficulty: 'Intermediate',
        muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
        equipment: 'Barbell',
        instructions: '1. Set up with bar over mid-foot\n2. Hinge at hips, grip bar\n3. Drive through heels to stand',
      },
    }),
  ])

  console.log('✅ Sample exercises created:', exercises.length)

  // Create sample program
  const program = await prisma.program.upsert({
    where: { id: 'program-1' },
    update: {},
    create: {
      id: 'program-1',
      userId: demoUser.id,
      name: 'Beginner Strength Program',
      description: 'A 4-week introduction to strength training',
      duration: 4,
      difficulty: 'Beginner',
      goals: ['Strength', 'Muscle Gain'],
      status: 'ACTIVE',
      startDate: new Date(),
    },
  })

  console.log('✅ Sample program created:', program.name)

  // Create sample workout
  const workout = await prisma.workout.upsert({
    where: { id: 'workout-1' },
    update: {},
    create: {
      id: 'workout-1',
      userId: demoUser.id,
      programId: program.id,
      name: 'Upper Body Day 1',
      description: 'Focus on pushing movements',
      duration: 45,
      status: 'PLANNED',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    },
  })

  console.log('✅ Sample workout created:', workout.name)

  // Add exercises to workout
  const workoutExercises = await Promise.all([
    prisma.workoutExercise.upsert({
      where: { workoutId_exerciseId: { workoutId: workout.id, exerciseId: exercises[0].id } },
      update: {},
      create: {
        workoutId: workout.id,
        exerciseId: exercises[0].id,
        sets: 3,
        reps: 10,
        rest: 60,
        notes: 'Focus on form',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { workoutId_exerciseId: { workoutId: workout.id, exerciseId: exercises[1].id } },
      update: {},
      create: {
        workoutId: workout.id,
        exerciseId: exercises[1].id,
        sets: 3,
        reps: 15,
        rest: 90,
        notes: 'Full range of motion',
      },
    }),
  ])

  console.log('✅ Workout exercises created:', workoutExercises.length)

  // Create sample messages
  const messages = await Promise.all([
    prisma.message.upsert({
      where: { id: 'message-1' },
      update: {},
      create: {
        id: 'message-1',
        userId: demoUser.id,
        content: 'Welcome to BRX Performance! Your training program has been created.',
        type: 'SYSTEM',
        priority: 'NORMAL',
        programId: program.id,
      },
    }),
    prisma.message.upsert({
      where: { id: 'message-2' },
      update: {},
      create: {
        id: 'message-2',
        userId: demoUser.id,
        content: 'Remember to complete your upper body workout tomorrow!',
        type: 'WORKOUT_REMINDER',
        priority: 'HIGH',
        workoutId: workout.id,
      },
    }),
  ])

  console.log('✅ Sample messages created:', messages.length)

  // Create user exercise records
  const userExercises = await Promise.all([
    prisma.userExercise.upsert({
      where: { userId_exerciseId: { userId: demoUser.id, exerciseId: exercises[0].id } },
      update: {},
      create: {
        userId: demoUser.id,
        exerciseId: exercises[0].id,
        personalBest: { reps: 15, date: '2024-01-15' },
        preferences: { reminderEnabled: true },
        notes: 'Working on increasing reps',
      },
    }),
  ])

  console.log('✅ User exercise records created:', userExercises.length)

  // Create BRX measurement types from collected data
  const brxMeasurementTypes = [
    { name: '20-yd Dash', category: 'SPEED', unit: 'seconds', brxStatKey: '20_yd_dash' },
    { name: '60-Yd Dash', category: 'SPEED', unit: 'seconds', brxStatKey: '60_yd_dash' },
    { name: 'Vertical Jump', category: 'POWER', unit: 'inches', brxStatKey: 'vertical_jump' },
    { name: 'Exit Velocity', category: 'HITTING', unit: 'mph', brxStatKey: 'exit_velocity' },
    { name: 'Position Throwing Velocity', category: 'THROWING', unit: 'mph', brxStatKey: 'position_throwing_velocity' },
    { name: 'Pitching Throwing Velocity', category: 'THROWING', unit: 'mph', brxStatKey: 'pitching_throwing_velocity' },
    { name: 'Weight', category: 'BODY_COMPOSITION', unit: 'lbs', brxStatKey: 'weight' },
    { name: 'Hours Of Sleep', category: 'RECOVERY', unit: 'hours', brxStatKey: 'hours_of_sleep' },
    { name: 'Session Satisfaction', category: 'RECOVERY', unit: 'rating', brxStatKey: 'session_satisfaction' },
    { name: 'Daily Protein (g)', category: 'NUTRITION', unit: 'grams', brxStatKey: 'daily_protein_g' },
  ]

  const measurementTypes = await Promise.all(
    brxMeasurementTypes.map(type =>
      prisma.measurementType.upsert({
        where: { name: type.name },
        update: {},
        create: {
          name: type.name,
          category: type.category,
          unit: type.unit,
          brxStatKey: type.brxStatKey,
          isDefault: true,
        },
      })
    )
  )

  console.log('✅ BRX measurement types created:', measurementTypes.length)

  // Create sample measurements for the demo user
  const sampleMeasurements = await Promise.all([
    prisma.userMeasurement.upsert({
      where: { id: 'measurement-1' },
      update: {},
      create: {
        id: 'measurement-1',
        userId: demoUser.id,
        measurementTypeId: measurementTypes[0].id, // 20-yd Dash
        value: 3.2,
        isPersonalBest: true,
        notes: 'Personal best at spring testing',
      },
    }),
    prisma.userMeasurement.upsert({
      where: { id: 'measurement-2' },
      update: {},
      create: {
        id: 'measurement-2',
        userId: demoUser.id,
        measurementTypeId: measurementTypes[2].id, // Vertical Jump
        value: 28.5,
        isPersonalBest: false,
        notes: 'Good improvement from last month',
      },
    }),
  ])

  console.log('✅ Sample measurements created:', sampleMeasurements.length)

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })