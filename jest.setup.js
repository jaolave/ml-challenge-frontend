// Jest setup file using CommonJS
require('@testing-library/jest-dom');

// Mock fetch globally
global.fetch = jest.fn();

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Setup environment variables for tests
process.env.API_BASE_URL = 'http://localhost:3000/api';
