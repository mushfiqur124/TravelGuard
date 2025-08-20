/**
 * Jest Test Setup
 * Global test configuration and mocks for MedMe extension
 */

// Mock Chrome extension APIs
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  },
  runtime: {
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    onInstalled: {
      addListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};

// Mock DOM APIs
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Console suppression for tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Test data
global.TEST_DATA = {
  countries: {
    "Argentina": {
      "mostTravellers": [
        {
          "name": "Hepatitis A",
          "description": "Test description",
          "prevention": "Test prevention"
        }
      ],
      "someTravellers": [],
      "lastUpdated": "2025-01-21T00:00:00.000Z",
      "sourceUrl": "https://test.com"
    }
  }
};
