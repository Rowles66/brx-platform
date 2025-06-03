# E2E Testing with Playwright

This directory contains end-to-end tests for the application using Playwright. The tests validate both the scraped UI components and live API responses.

## Test Structure

```
tests/
├── e2e/
│   ├── signin.spec.ts          # SignIn form tests
│   ├── api.spec.ts             # API endpoint validation
│   ├── components.spec.ts      # UI component tests
│   ├── integration.spec.ts     # Full integration tests
│   └── utils/
│       └── test-helpers.ts     # Reusable test utilities
└── README.md
```

## Test Categories

### 1. UI Component Tests (`components.spec.ts`)
- Tests scraped UI components (SignInForm, etc.)
- Validates form behavior and interactions
- Checks responsive design
- Verifies accessibility features
- Tests keyboard navigation

### 2. API Validation Tests (`api.spec.ts`)
- Validates all tRPC endpoints return 200 status
- Tests API response times
- Verifies content-type headers
- Tests concurrent API requests
- Handles invalid endpoints gracefully

### 3. SignIn Form Tests (`signin.spec.ts`)
- Tests form loading and rendering
- Validates form submission with demo credentials
- Tests error handling for invalid credentials
- Checks loading states during submission
- Validates performance requirements

### 4. Integration Tests (`integration.spec.ts`)
- Complete user flows with API validation
- Performance testing under load
- Error recovery testing
- Session state management
- Network interruption handling

## Running Tests

### Local Development

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Specific Test Files

```bash
# Run specific test file
npx playwright test signin.spec.ts

# Run specific test
npx playwright test --grep "should load the sign in form"

# Run tests in specific browser
npx playwright test --project=chromium
```

### CI/CD with GitHub Actions

Tests run automatically on:
- Pull requests to `main` or `develop` branches
- Pushes to `main` branch
- Manual workflow dispatch

The GitHub Action workflow:
- Sets up Node.js and PostgreSQL
- Installs dependencies and Playwright browsers
- Builds the application
- Runs tests with 1Password CLI integration
- Uploads test reports and artifacts

## Test Configuration

### Environment Variables

- `BASE_URL`: Application URL (default: http://localhost:3000)
- `DATABASE_URL`: Database connection string
- `CI`: Set to `true` in CI environments

### Browser Support

Tests run on:
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Utilities

The `TestHelpers` class provides reusable functions:

```typescript
const helpers = new TestHelpers(page);

// Fill and submit sign-in form
await helpers.fillAndSubmitSignInForm(email, password, rememberMe);

// Validate API endpoint
await helpers.validateApiEndpoint('/api/endpoint', 'POST', data);

// Test responsive design
await helpers.testResponsiveDesign('form');

// Test keyboard navigation
await helpers.testKeyboardNavigation(['input', 'button']);
```

## Test Data

Predefined test data is available:

```typescript
import { TestData } from './utils/test-helpers';

// Valid demo credentials
TestData.validCredentials.email    // 'demo@example.com'
TestData.validCredentials.password // 'password'

// Invalid credentials for error testing
TestData.invalidCredentials.email    // 'invalid@example.com'
TestData.invalidCredentials.password // 'wrongpassword'
```

## API Testing

All tRPC endpoints are tested:
- `example.hello` - Example endpoint
- `auth.login` - Authentication
- `users.getAll` - User management
- `exercises.getAll` - Exercise data
- `workouts.getAll` - Workout data
- `userProgress.getAll` - Progress tracking

## Performance Testing

Tests include performance validation:
- Page load time < 5 seconds
- API response time < 2 seconds
- Form interaction time < 1 second
- Network idle state verification

## Accessibility Testing

Basic accessibility checks:
- Form labels and aria-labels
- Keyboard navigation
- Focus management
- Screen reader compatibility

## Debugging Tests

### Local Debugging

```bash
# Debug mode with browser open
npm run test:e2e:debug

# Run in headed mode
npm run test:e2e:headed

# Generate trace files
npx playwright test --trace on
```

### CI Debugging

Test artifacts are uploaded on failure:
- Screenshots
- Videos
- Trace files
- Test reports

### Common Issues

1. **Tests timing out**: Increase timeout in test or check if app is running
2. **Element not found**: Verify selectors match actual DOM structure
3. **API tests failing**: Check if tRPC endpoints are properly configured
4. **Flaky tests**: Add proper waits and stability checks

## Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Wait for elements** before interacting with them
3. **Use helpers** for common operations
4. **Test error states** as well as happy paths
5. **Keep tests independent** - don't rely on test order
6. **Use meaningful test names** that describe the behavior
7. **Group related tests** in describe blocks
8. **Clean up resources** after tests

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use the TestHelpers utilities
3. Add meaningful assertions
4. Test both success and error cases
5. Ensure tests are reliable and not flaky
6. Update this documentation if needed

## Security Considerations

- Tests use 1Password CLI for secure environment variables
- No secrets are hardcoded in test files
- Test database is isolated from production
- API tests use safe, non-destructive operations

## Future Enhancements

- Visual regression testing
- Performance monitoring integration
- Automated accessibility audits
- API contract testing
- Load testing scenarios
- Cross-device testing

