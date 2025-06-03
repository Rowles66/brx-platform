import { test, expect } from '@playwright/test';

test.describe('API Endpoint Validation', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  test('should verify tRPC example endpoint returns 200', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/trpc/example.hello?input=%7B%22json%22%3A%7B%22text%22%3A%22test%22%7D%7D`);
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toBeDefined();
    expect(body.result).toBeDefined();
  });

  test('should verify auth router endpoint returns 200', async ({ request }) => {
    // Test auth router - this might return different responses based on implementation
    const response = await request.post(`${baseURL}/api/trpc/auth.login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        json: {
          email: 'test@example.com',
          password: 'testpassword'
        }
      }
    });
    
    // Should return 200 even if auth fails (tRPC handles errors in response body)
    expect(response.status()).toBe(200);
  });

  test('should verify users router endpoint returns 200', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/trpc/users.getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {}
    });
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toBeDefined();
  });

  test('should verify exercises router endpoint returns 200', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/trpc/exercises.getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {}
    });
    
    expect(response.status()).toBe(200);
  });

  test('should verify workouts router endpoint returns 200', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/trpc/workouts.getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {}
    });
    
    expect(response.status()).toBe(200);
  });

  test('should verify user progress router endpoint returns 200', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/trpc/userProgress.getAll`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {}
    });
    
    expect(response.status()).toBe(200);
  });

  test('should handle invalid tRPC endpoint gracefully', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/trpc/nonexistent.endpoint`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {}
    });
    
    // tRPC should return 200 with error in body for invalid procedures
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toBeDefined();
    // Should contain error information
    expect(body.error).toBeDefined();
  });

  test('should verify API response times are reasonable', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.get(`${baseURL}/api/trpc/example.hello?input=%7B%22json%22%3A%7B%22text%22%3A%22test%22%7D%7D`);
    
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    // API should respond within 2 seconds
    expect(responseTime).toBeLessThan(2000);
  });

  test('should verify API returns proper content-type', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/trpc/example.hello?input=%7B%22json%22%3A%7B%22text%22%3A%22test%22%7D%7D`);
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should test API under concurrent load', async ({ request }) => {
    // Test multiple concurrent requests
    const promises = Array.from({ length: 5 }, (_, i) => 
      request.get(`${baseURL}/api/trpc/example.hello?input=%7B%22json%22%3A%7B%22text%22%3A%22test${i}%22%7D%7D`)
    );
    
    const responses = await Promise.all(promises);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });
});

