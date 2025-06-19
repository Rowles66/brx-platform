import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';

// Initialize AI clients with your API keys from environment
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Vercel AI SDK providers
export const vercelOpenAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const vercelAnthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configurations for different use cases
export const AI_MODELS = {
  // For chat and general purpose
  chat: {
    fast: 'gpt-3.5-turbo',
    smart: 'gpt-4-turbo-preview',
    claude: 'claude-3-sonnet-20240229',
    claudeOpus: 'claude-3-opus-20240229',
  },
  // For embeddings and semantic search
  embedding: {
    default: 'text-embedding-3-small',
    large: 'text-embedding-3-large',
  },
  // For code generation
  code: {
    default: 'gpt-4-turbo-preview',
    claude: 'claude-3-opus-20240229',
  },
  // For vision tasks
  vision: {
    gpt4: 'gpt-4-vision-preview',
    dalle: 'dall-e-3',
  },
  // For audio
  audio: {
    whisper: 'whisper-1',
    tts: 'tts-1',
    ttsHD: 'tts-1-hd',
  },
} as const;

// Helper function to choose the best model based on task
export function selectModel(task: 'chat' | 'code' | 'analysis' | 'creative') {
  switch (task) {
    case 'chat':
      return AI_MODELS.chat.fast;
    case 'code':
      return AI_MODELS.code.claude; // Claude is excellent for code
    case 'analysis':
      return AI_MODELS.chat.smart;
    case 'creative':
      return AI_MODELS.chat.claudeOpus;
    default:
      return AI_MODELS.chat.smart;
  }
} 
