import { vercelAnthropic, vercelOpenAI } from '@/lib/ai/client';
import { streamText } from 'ai';

// Allow streaming responses
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, model = 'gpt-4-turbo-preview' } = await req.json();

  // Choose provider based on model
  const provider = model.startsWith('claude') ? vercelAnthropic : vercelOpenAI;

  const result = await streamText({
    model: provider(model),
    messages,
    system: 'You are a helpful fitness and nutrition assistant for BRX Performance athletes. Provide evidence-based advice tailored to athletic performance.',
  });

  return result.toDataStreamResponse();
} 
