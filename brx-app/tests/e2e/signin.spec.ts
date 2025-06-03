import { test, expect } from '@playwright/test';

test.describe('SignIn Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
  });

  test('should load the sign in form and interact with elements', async ({ page }) => {
    // Wait for the form to be visible
    await expect(page.locator('form')).toBeVisible();
    
    // Check that all form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test form interaction
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.check('input[type="checkbox"]');
    
    // Verify the form values
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
  });

  test('should submit form and handle demo credentials', async ({ page }) => {
    // Fill form with demo credentials
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check that the form shows loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    
    // Wait for the form to finish processing (max 3 seconds)
    await page.waitForFunction(() => {
      const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      return button && !button.disabled;
    }, { timeout: 3000 });
    
    // Verify form is no longer in loading state
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 3000 });
  });

  test('should validate API endpoints are accessible', async ({ page, request }) => {
    // Test tRPC API endpoint accessibility
    const apiResponse = await request.get('/api/trpc/example.hello?input=%7B%22json%22%3A%7B%22text%22%3A%22test%22%7D%7D');
    expect(apiResponse.status()).toBe(200);
    
    // Test that the API returns valid JSON
    const responseBody = await apiResponse.json();
    expect(responseBody).toBeDefined();
  });

  test('should verify tRPC endpoint responds with 200', async ({ request }) => {
    // Test the base tRPC endpoint
    const response = await request.post('/api/trpc/example.hello', {
      data: {
        json: { text: 'Hello from Playwright test' }
      }
    });
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.result).toBeDefined();
  });

  test('should test auth router endpoint', async ({ request }) => {
    // Test the auth router endpoint (assuming it has a health check or similar)
    const response = await request.post('/api/trpc/users.getAll', {
      data: {}
    });
    
    // Should return 200 even if it's empty data or requires auth
    expect(response.status()).toBe(200);
  });

  test('should validate page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Form should be interactive
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeEnabled();
  });
});

