import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Quick Validation', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate tRPC example endpoint returns 200', async ({ request }) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const response = await request.get(`${baseURL}/api/trpc/example.hello?input=%7B%22json%22%3A%7B%22text%22%3A%22test%22%7D%7D`);
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toBeDefined();
    expect(body.result).toBeDefined();
  });

  test('should submit form with demo credentials', async ({ page }) => {
    await page.goto('/');
    
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
});

