import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for any fonts/styles to load
    await page.goto('/', { waitUntil: 'networkidle' });
    // Disable animations for consistent screenshots
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

  test('should match homepage screenshot - desktop', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage screenshot - mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile viewports');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match header component', async ({ page }) => {
    const header = page.locator('header, nav, [data-testid="header"]').first();
    if (await header.count() > 0) {
      await expect(header).toHaveScreenshot('header-component.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match footer component', async ({ page }) => {
    const footer = page.locator('footer, [data-testid="footer"]').first();
    if (await footer.count() > 0) {
      await expect(footer).toHaveScreenshot('footer-component.png', {
        animations: 'disabled',
      });
    }
  });

  test('should handle hover states consistently', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover states not applicable on mobile');
    
    // Find interactive elements
    const buttons = page.locator('button, a[href], [role="button"]');
    const firstButton = buttons.first();
    
    if (await firstButton.count() > 0) {
      // Hover and take screenshot
      await firstButton.hover();
      await page.waitForTimeout(100); // Allow hover state to settle
      
      await expect(firstButton).toHaveScreenshot('button-hover-state.png', {
        animations: 'disabled',
      });
    }
  });
});

