import { test, expect } from '@playwright/test';

test.describe('Sign In Page Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'networkidle' });
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test('should match signin page screenshot - desktop', async ({ page }) => {
    await expect(page).toHaveScreenshot('signin-page-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match signin page screenshot - mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile viewports');
    await expect(page).toHaveScreenshot('signin-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match form elements', async ({ page }) => {
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await expect(form).toHaveScreenshot('signin-form.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match focused input field', async ({ page }) => {
    const input = page.locator('input[type="email"], input[type="text"]').first();
    if (await input.count() > 0) {
      await input.focus();
      await expect(input).toHaveScreenshot('focused-input-field.png', {
        animations: 'disabled',
      });
    }
  });
});

