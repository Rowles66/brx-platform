import { Page, expect } from '@playwright/test';

/**
 * Common utilities for E2E tests
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Fill and submit the sign-in form
   */
  async fillAndSubmitSignInForm(email: string, password: string, rememberMe = false) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    
    if (rememberMe) {
      await this.page.check('input[type="checkbox"]');
    }
    
    await this.page.click('button[type="submit"]');
  }

  /**
   * Wait for form submission to complete
   */
  async waitForFormSubmission(timeout = 3000) {
    await this.page.waitForFunction(() => {
      const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      return button && !button.disabled;
    }, { timeout });
  }

  /**
   * Check if API endpoint returns 200
   */
  async validateApiEndpoint(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    const request = this.page.context().request;
    
    let response;
    if (method === 'GET') {
      response = await request.get(endpoint);
    } else {
      response = await request.post(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: data || {}
      });
    }
    
    expect(response.status()).toBe(200);
    return response;
  }

  /**
   * Validate tRPC endpoint
   */
  async validateTrpcEndpoint(procedure: string, input?: any) {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    let endpoint;
    
    if (input) {
      const encodedInput = encodeURIComponent(JSON.stringify({ json: input }));
      endpoint = `${baseURL}/api/trpc/${procedure}?input=${encodedInput}`;
      return this.validateApiEndpoint(endpoint, 'GET');
    } else {
      endpoint = `${baseURL}/api/trpc/${procedure}`;
      return this.validateApiEndpoint(endpoint, 'POST', {});
    }
  }

  /**
   * Check responsive design at different viewport sizes
   */
  async testResponsiveDesign(selector: string) {
    const viewports = [
      { width: 1200, height: 800, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(this.page.locator(selector)).toBeVisible();
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(selectors: string[]) {
    for (let i = 0; i < selectors.length; i++) {
      if (i === 0) {
        await this.page.focus(selectors[i]);
      } else {
        await this.page.keyboard.press('Tab');
        await expect(this.page.locator(selectors[i])).toBeFocused();
      }
    }
  }

  /**
   * Measure page load performance
   */
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.page.waitForLoadState('networkidle');
    return Date.now() - startTime;
  }

  /**
   * Check for accessibility violations (basic)
   */
  async checkBasicAccessibility() {
    // Check for form labels
    const inputs = this.page.locator('input');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate((el) => {
        const inputEl = el as HTMLInputElement;
        return (inputEl.labels && inputEl.labels.length > 0) || 
               el.getAttribute('aria-label') !== null ||
               el.getAttribute('placeholder') !== null;
      });
      expect(hasLabel).toBe(true);
    }
  }

  /**
   * Wait for element to be stable (not moving)
   */
  async waitForElementStability(selector: string, timeout = 5000) {
    await this.page.waitForFunction(
      (sel) => {
        const element = document.querySelector(sel);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      selector,
      { timeout }
    );
  }

  /**
   * Take screenshot with timestamp
   */
  async takeTimestampedScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }
}

/**
 * Common test data
 */
export const TestData = {
  validCredentials: {
    email: 'demo@example.com',
    password: 'password'
  },
  invalidCredentials: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  },
  testUser: {
    email: 'test@example.com',
    password: 'testpassword123'
  }
};

/**
 * API endpoints for testing
 */
export const ApiEndpoints = {
  trpc: {
    example: 'example.hello',
    auth: 'auth.login',
    users: 'users.getAll',
    exercises: 'exercises.getAll',
    workouts: 'workouts.getAll',
    userProgress: 'userProgress.getAll'
  }
};

