import { generateText, streamText } from 'ai';
import { AI_MODELS, anthropic, openai, vercelAnthropic, vercelOpenAI } from './client';

// Example 1: AI-Powered Workout Generation
export async function generateWorkout(userProfile: {
  fitnessLevel: string;
  goals: string[];
  equipment: string[];
  timeAvailable: number;
}) {
  const prompt = `Generate a personalized workout plan for:
    - Fitness Level: ${userProfile.fitnessLevel}
    - Goals: ${userProfile.goals.join(', ')}
    - Available Equipment: ${userProfile.equipment.join(', ')}
    - Time Available: ${userProfile.timeAvailable} minutes
    
    Format as JSON with exercises, sets, reps, and rest periods.`;

  // Using Vercel AI SDK for structured output
  const { text } = await generateText({
    model: vercelOpenAI('gpt-4-turbo-preview'),
    prompt,
    system: 'You are an expert fitness coach. Generate safe, effective workout plans.',
  });

  return JSON.parse(text);
}

// Example 2: AI Form Analysis with Vision
export async function analyzeExerciseForm(imageUrl: string, exercise: string) {
  const response = await openai.chat.completions.create({
    model: AI_MODELS.vision.gpt4,
    messages: [
      {
        role: 'system',
        content: 'You are an expert fitness coach analyzing exercise form.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze the form for ${exercise}. Point out any issues and provide corrections.`,
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}

// Example 3: AI Nutrition Assistant
export async function generateMealPlan(requirements: {
  calories: number;
  protein: number;
  dietaryRestrictions: string[];
  preferences: string[];
}) {
  // Using Claude for detailed analysis
  const response = await anthropic.messages.create({
    model: AI_MODELS.chat.claudeOpus,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Create a detailed daily meal plan with:
          - Target calories: ${requirements.calories}
          - Target protein: ${requirements.protein}g
          - Dietary restrictions: ${requirements.dietaryRestrictions.join(', ')}
          - Preferences: ${requirements.preferences.join(', ')}
          
          Include recipes and macros for each meal.`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Example 4: Real-time Chat Assistant
export async function createChatStream(messages: any[]) {
  // Using Vercel AI SDK for streaming
  const result = await streamText({
    model: vercelAnthropic('claude-3-sonnet-20240229'),
    messages,
    system: 'You are a helpful fitness and nutrition assistant for BRX Performance athletes.',
  });

  return result.toDataStreamResponse();
}

// Example 5: Semantic Search for Exercises
export async function createEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: AI_MODELS.embedding.default,
    input: text,
  });

  return response.data[0].embedding;
}

// Example 6: Voice Coaching
export async function generateVoiceCoaching(text: string, voice: 'alloy' | 'echo' | 'fable' = 'alloy') {
  const mp3 = await openai.audio.speech.create({
    model: AI_MODELS.audio.tts,
    voice,
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
}

// Example 7: Performance Analysis
export async function analyzePerformanceData(data: {
  workouts: any[];
  metrics: any[];
  goals: string[];
}) {
  const prompt = `Analyze this athlete's performance data and provide insights:
    
    Recent Workouts: ${JSON.stringify(data.workouts)}
    Performance Metrics: ${JSON.stringify(data.metrics)}
    Goals: ${data.goals.join(', ')}
    
    Provide:
    1. Performance trends
    2. Areas of improvement
    3. Recommendations
    4. Goal progress assessment`;

  const { text } = await generateText({
    model: vercelOpenAI('gpt-4-turbo-preview'),
    prompt,
    temperature: 0.3, // Lower temperature for more consistent analysis
  });

  return text;
}

// Example 8: AI-Powered Exercise Recognition
export async function recognizeExercise(videoUrl: string) {
  // This would integrate with a specialized model or API
  // For now, using GPT-4V as an example
  const response = await openai.chat.completions.create({
    model: AI_MODELS.vision.gpt4,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What exercise is being performed in this video? Identify the exercise and count the reps.',
          },
          {
            type: 'image_url',
            image_url: { url: videoUrl },
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
} 
