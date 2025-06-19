'use client';

import { useChat, useCompletion } from 'ai/react';
import { useState } from 'react';
import { analyzePerformanceData, generateWorkout } from './examples';

// Hook for AI-powered chat
export function useAIChat() {
  return useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: 'You are a helpful fitness assistant for BRX Performance athletes.',
      },
    ],
  });
}

// Hook for workout generation
export function useWorkoutGenerator() {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (profile: {
    fitnessLevel: string;
    goals: string[];
    equipment: string[];
    timeAvailable: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateWorkout(profile);
      setWorkout(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate workout');
    } finally {
      setLoading(false);
    }
  };

  return { generate, workout, loading, error };
}

// Hook for AI completions
export function useAICompletion(purpose: 'exercise' | 'nutrition' | 'recovery') {
  const systemPrompts = {
    exercise: 'You are an expert exercise coach. Provide detailed exercise instructions.',
    nutrition: 'You are a certified nutritionist. Provide evidence-based nutrition advice.',
    recovery: 'You are a recovery specialist. Provide recovery and injury prevention advice.',
  };

  return useCompletion({
    api: '/api/ai/completion',
    body: {
      system: systemPrompts[purpose],
    },
  });
}

// Hook for performance insights
export function usePerformanceInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (data: {
    workouts: any[];
    metrics: any[];
    goals: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePerformanceData(data);
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze performance');
    } finally {
      setLoading(false);
    }
  };

  return { analyze, insights, loading, error };
} 
