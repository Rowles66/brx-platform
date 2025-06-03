import { test, expect } from '@playwright/test';

test.describe('Scraped UI Components Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render SignInForm component correctly', async ({ page }) => {
    // Check main form structure
    await expect(page.locator('form')).toBeVisible();
    
    // Check email field
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toBeVisible();
    await expect(emailField).toHaveAttribute('placeholder');
    
    // Check password field
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toHaveAttribute('placeholder');
    
    // Check remember me checkbox
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    
    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should validate form fields behavior', async ({ page }) => {
    // Test email field validation (HTML5)
    const emailField = page.locator('input[type="email"]');
    await emailField.fill('invalid-email');
    await emailField.blur();
    
    // Test password field
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill('test123');
    await expect(passwordField).toHaveValue('test123');
    
    // Test checkbox toggle
    const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should display loading state during form submission', async ({ page }) => {
    // Fill valid form data
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check loading state
    await expect(submitButton).toBeDisabled();
    
    // Wait for form to finish processing
    await page.waitForFunction(() => {
      const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      return button && !button.disabled;
    }, { timeout: 3000 });
  });

  test('should handle error states properly', async ({ page }) => {
    // Submit with invalid credentials to trigger error
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for and verify error message
    const errorMessage = page.locator('text=Invalid email or password');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('form')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('form')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('form')).toBeVisible();
    
    // Form should still be functional on mobile
    await page.fill('input[type="email"]', 'test@mobile.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@mobile.com');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check form has proper labels/aria-labels
    const emailField = page.locator('input[type="email"]');
    const passwordField = page.locator('input[type="password"]');
    
    // These elements should have associated labels or aria-labels
    await expect(emailField).toHaveAttribute('placeholder');
    await expect(passwordField).toHaveAttribute('placeholder');
    
    // Form should be keyboard navigable
    await emailField.focus();
    await page.keyboard.press('Tab');
    await expect(passwordField).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type="checkbox"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should maintain form state during user interaction', async ({ page }) => {
    // Fill form partially
    await page.fill('input[type="email"]', 'test@example.com');
    await page.check('input[type="checkbox"]');
    
    // Click elsewhere to test state persistence
    await page.click('body');
    
    // Values should be preserved
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
    
    // Continue filling form
    await page.fill('input[type="password"]', 'testpassword');
    
    // All values should still be there
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[type="password"]')).toHaveValue('testpassword');
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
  });

  test('should handle keyboard navigation and submission', async ({ page }) => {
    // Fill form using keyboard only
    await page.press('body', 'Tab'); // Focus first input
    await page.keyboard.type('keyboard@test.com');
    
    await page.keyboard.press('Tab'); // Move to password
    await page.keyboard.type('keyboardtest');
    
    await page.keyboard.press('Tab'); // Move to checkbox
    await page.keyboard.press('Space'); // Check checkbox
    
    await page.keyboard.press('Tab'); // Move to submit button
    await page.keyboard.press('Enter'); // Submit form
    
    // Form should submit
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});

