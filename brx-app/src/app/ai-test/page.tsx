'use client';

import { useState } from 'react';

export default function AITestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState('');

  const testAISDK = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Failed to test' });
    } finally {
      setLoading(false);
    }
  };

  const testStreaming = async () => {
    setStreaming('');
    try {
      const response = await fetch('/api/ai/test', { method: 'POST' });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        setStreaming(prev => prev + chunk);
      }
    } catch (error) {
      setStreaming('Error: ' + (error instanceof Error ? error.message : 'Failed'));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Vercel AI SDK Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Basic Generation</h2>
          <button
            onClick={testAISDK}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test AI SDK'}
          </button>
          
          {result && (
            <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Streaming</h2>
          <button
            onClick={testStreaming}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Streaming Response
          </button>
          
          {streaming && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              {streaming}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">✅ AI SDK Setup Complete!</h3>
          <p>The Vercel AI SDK is installed and ready to use with:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Text generation (generateText)</li>
            <li>Streaming responses (streamText)</li>
            <li>Multiple providers (OpenAI, Anthropic)</li>
            <li>React hooks (useChat, useCompletion)</li>
            <li>Edge runtime support</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
