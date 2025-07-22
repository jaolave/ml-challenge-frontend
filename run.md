# How to Run the Project

This document provides instructions to set up and run this project locally.

## Environment Variables

The application requires the following environment variables to be configured:

-   `API_BASE_URL`: The URL of the product data API.
-   `API_KEY`: Your Google Gemini API key for the Q&A feature.

### Local Development Setup

Because this project uses a simple static server for local development, there is no build process to automatically handle `.env` files. Therefore, you must temporarily modify the source code to provide these values.

#### 1. Configure Backend API URL (Required)

1.  Open the file: `lib/api.ts`.
2.  Find the following line:
    ```javascript
    const API_BASE_URL = process.env.API_BASE_URL;
    ```
3.  Replace `process.env.API_BASE_URL` with the backend URL in quotes. For this challenge, use the following URL:
    ```javascript
    const API_BASE_URL = 'https://backend-url/api/v1';
    ```

#### 2. Configure Gemini API Key (Required)

1.  Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Open the file: `features/product-questions/Questions.tsx`.
3.  Find this line:
    ```javascript
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    ```
4.  Replace `process.env.API_KEY` with your actual API key in quotes:
    ```javascript
    const ai = new GoogleGenAI({ apiKey: 'YOUR_API_KEY_HERE' });
    ```

> **Important**: Do not commit your API key to public repositories. These changes are for local development only.

## Running the Application

After configuring the variables, you can start the server.

1.  **Start Server**: Open a terminal in the project's root folder and run:
    ```bash
    npx serve
    ```
2.  **Open App**: The terminal will show a local URL (e.g., `http://localhost:3000`). Open this URL in your browser.

## Testing

This project includes a comprehensive testing environment with unit tests and code coverage reporting configured to meet industry standards.

### Testing Environment Overview

The testing setup includes:

- **Jest** as the testing framework with TypeScript support
- **jsdom** environment for testing DOM-related functionality
- **Code coverage** reporting with an 80% threshold requirement
- **Mocking capabilities** for API calls and external dependencies
- **Type validation** tests for TypeScript interfaces

### Available Test Commands

#### Run All Tests

```bash
npm test
```

Executes all test suites and displays results.

#### Run Tests with Coverage Report

```bash
npm run test:coverage
```

Runs all tests and generates a detailed code coverage report. The report will be:

- Displayed in the terminal
- Saved as HTML in the `coverage/` directory
- Saved as LCOV format for CI/CD integration

#### Watch Mode for Development

```bash
npm run test:watch
```

Runs tests in watch mode, automatically re-running tests when files change. Ideal for development.

#### CI/CD Mode

```bash
npm run test:ci
```

Runs tests once with coverage reporting, suitable for continuous integration environments.

### Coverage Requirements

The project is configured with the following minimum coverage thresholds:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Tests will fail if coverage falls below these thresholds, ensuring code quality standards.

### Test Structure

#### Unit Tests Location

- Tests are located in the `__tests__/` directory
- Test files follow the naming convention: `*.test.ts` or `*.spec.ts`

#### Current Test Coverage

**API Functions (`lib/api.ts`)**

- ✅ All exported functions tested
- ✅ Error handling scenarios
- ✅ Network failure simulation
- ✅ Data transformation validation
- ✅ JSON parsing edge cases

**Type Definitions (`lib/types.ts`)**

- ✅ Interface validation tests
- ✅ Optional and nullable fields
- ✅ Complex nested structures
- ✅ Type safety verification

### Writing New Tests

When adding new functionality, follow these testing guidelines:

#### 1. Test File Naming

Create test files in the `__tests__/` directory with descriptive names:

```
__tests__/
  ├── api.test.ts          # API function tests
  ├── types.test.ts        # Type validation tests
  └── newFeature.test.ts   # New feature tests
```

#### 2. Test Structure Example

```typescript
import { functionToTest } from '../lib/yourModule';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup for each test
  });

  describe('Specific Function', () => {
    it('should handle normal case', () => {
      // Test implementation
    });

    it('should handle edge cases', () => {
      // Edge case testing
    });

    it('should handle errors gracefully', () => {
      // Error scenario testing
    });
  });
});
```

#### 3. Mocking External Dependencies

The testing environment includes global mocks for:

- `fetch` API for HTTP requests
- `console.error` to reduce test noise
- Environment variables for configuration

### Coverage Reports

#### Terminal Output

After running `npm run test:coverage`, you'll see a coverage summary in the terminal showing:

- File-by-file coverage percentages
- Overall project coverage
- Uncovered lines and branches

#### HTML Report

A detailed HTML report is generated in `coverage/lcov-report/index.html` which provides:

- Interactive file browsing
- Line-by-line coverage visualization
- Branch coverage details
- Function coverage mapping

### Continuous Integration

The testing setup is CI/CD ready with:

- Exit codes that fail builds on test failures
- Coverage reports in LCOV format
- Configurable thresholds for quality gates
- No interactive prompts in CI mode

### Troubleshooting Tests

#### Common Issues

**Module Import Errors**

- Ensure all imports use relative paths
- Check TypeScript configuration for path mapping

**Mock Not Working**

- Verify mocks are set up in `beforeEach` hooks
- Clear mocks between tests using `mockClear()`

**Coverage Below Threshold**

- Add tests for uncovered lines shown in reports
- Consider if untested code is necessary
- Use `collectCoverageFrom` patterns to exclude non-essential files

#### Debug Mode

To debug tests, you can:

1. Add `console.log` statements in tests
2. Use `jest --verbose` for detailed output
3. Run specific test files: `npm test -- api.test.ts`

### Best Practices

1. **Test Behavior, Not Implementation** - Focus on what functions do, not how they do it
2. **Use Descriptive Test Names** - Test names should explain the scenario and expected outcome
3. **Keep Tests Independent** - Each test should work in isolation
4. **Mock External Dependencies** - Don't make real API calls in tests
5. **Test Edge Cases** - Include error scenarios and boundary conditions
6. **Maintain High Coverage** - Aim for the 80% threshold across all metrics
