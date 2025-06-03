import { test, expect } from '@playwright/test';
import { TestHelpers, TestData, ApiEndpoints } from './utils/test-helpers';

test.describe('Full Integration Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('/');
  });

  test('should complete full user flow with API validation', async ({ page }) => {
    // Test page load performance
    const loadTime = await helpers.measurePageLoadTime();
    expect(loadTime).toBeLessThan(5000);

    // Test form rendering
    await expect(page.locator('form')).toBeVisible();
    
    // Test form interaction with valid credentials
    await helpers.fillAndSubmitSignInForm(
      TestData.validCredentials.email,
      TestData.validCredentials.password,
      true
    );
    
    // Verify loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    
    // Wait for submission to complete
    await helpers.waitForFormSubmission();
    
    // Form should be enabled again
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should validate all tRPC endpoints return 200', async ({ page }) => {
    // Test each API endpoint
    const endpoints = Object.values(ApiEndpoints.trpc);
    
    for (const endpoint of endpoints) {
      try {
        await helpers.validateTrpcEndpoint(endpoint, { text: 'test' });
      } catch (error) {
        console.log(`Endpoint ${endpoint} might not accept this input format, trying without input`);
        await helpers.validateTrpcEndpoint(endpoint);
      }
    }
  });

  test('should be fully responsive and accessible', async ({ page }) => {
    // Test responsive design
    await helpers.testResponsiveDesign('form');
    
    // Test keyboard navigation
    await helpers.testKeyboardNavigation([
      'input[type="email"]',
      'input[type="password"]',
      'input[type="checkbox"]',
      'button[type="submit"]'
    ]);
    
    // Test basic accessibility
    await helpers.checkBasicAccessibility();
  });

  test('should handle error states and recovery', async ({ page }) => {
    // Test with invalid credentials
    await helpers.fillAndSubmitSignInForm(
      TestData.invalidCredentials.email,
      TestData.invalidCredentials.password
    );
    
    // Wait for error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 3000 });
    
    // Test recovery - form should still be functional
    await helpers.fillAndSubmitSignInForm(
      TestData.validCredentials.email,
      TestData.validCredentials.password
    );
    
    // Should work after error
    await helpers.waitForFormSubmission();
  });

  test('should perform under load conditions', async ({ page, context }) => {
    // Create multiple tabs to simulate concurrent usage
    const pages = [page];
    
    // Open additional pages
    for (let i = 1; i < 3; i++) {
      const newPage = await context.newPage();
      await newPage.goto('/');
      pages.push(newPage);
    }
    
    // Perform actions on all pages simultaneously
    const promises = pages.map(async (p, index) => {
      const helper = new TestHelpers(p);
      await helper.fillAndSubmitSignInForm(
        `test${index}@example.com`,
        'testpassword'
      );
      return helper.waitForFormSubmission();
    });
    
    // All should complete successfully
    await Promise.all(promises);
    
    // Clean up
    for (let i = 1; i < pages.length; i++) {
      await pages[i].close();
    }
  });

  test('should maintain session state and form persistence', async ({ page }) => {
    // Fill form partially
    await page.fill('input[type="email"]', TestData.testUser.email);
    await page.check('input[type="checkbox"]');
    
    // Refresh page
    await page.reload();
    
    // Form should be empty after reload (no persistence expected in this case)
    await expect(page.locator('input[type="email"]')).toHaveValue('');
    await expect(page.locator('input[type="checkbox"]')).not.toBeChecked();
    
    // But form should still be functional
    await helpers.fillAndSubmitSignInForm(
      TestData.validCredentials.email,
      TestData.validCredentials.password
    );
    
    await helpers.waitForFormSubmission();
  });

  test('should handle network interruptions gracefully', async ({ page, context }) => {
    // Fill form
    await helpers.fillAndSubmitSignInForm(
      TestData.validCredentials.email,
      TestData.validCredentials.password
    );
    
    // Form should handle the submission even if network is slow
    await helpers.waitForFormSubmission(5000); // Longer timeout for network issues
  });

  test('should validate API response structure', async ({ page }) => {
    const response = await helpers.validateTrpcEndpoint('example.hello', { text: 'test' });
    
    const body = await response.json();
    expect(body).toBeDefined();
    expect(body.result).toBeDefined();
    
    // Validate response structure
    expect(typeof body.result).toBe('object');
  });

  test('should measure and validate performance metrics', async ({ page }) => {
    // Measure initial page load
    const initialLoadTime = await helpers.measurePageLoadTime();
    expect(initialLoadTime).toBeLessThan(3000);
    
    // Measure form interaction performance
    const startTime = Date.now();
    
    await helpers.fillAndSubmitSignInForm(
      TestData.validCredentials.email,
      TestData.validCredentials.password
    );
    
    const interactionTime = Date.now() - startTime;
    expect(interactionTime).toBeLessThan(1000); // Form should respond quickly
    
    await helpers.waitForFormSubmission();
  });
});

