import { vercelOpenAI } from '@/lib/ai/client';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the AI SDK with a simple generation
    const { text } = await generateText({
      model: vercelOpenAI('gpt-3.5-turbo'),
      prompt: 'Say "AI SDK is working!" in a motivational fitness coach style.',
      temperature: 0.7,
      maxTokens: 50,
    });

    return NextResponse.json({
      success: true,
      message: 'Vercel AI SDK is properly configured!',
      test_response: text,
      available_features: [
        'Text generation (generateText)',
        'Streaming responses (streamText)',
        'Tool calling',
        'Multiple AI providers (OpenAI, Anthropic)',
        'Edge runtime support',
      ],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: {
        check_env_vars: [
          'OPENAI_API_KEY',
          'ANTHROPIC_API_KEY',
        ],
        verify_imports: 'Ensure @/lib/ai/client exports are correct',
      },
    }, { status: 500 });
  }
}

// Test POST endpoint for streaming
export async function POST() {
  try {
    const { streamText } = await import('ai');
    
    const result = await streamText({
      model: vercelOpenAI('gpt-3.5-turbo'),
      prompt: 'List 3 quick fitness tips',
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 
