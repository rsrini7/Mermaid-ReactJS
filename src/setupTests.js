import '@testing-library/jest-dom';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock other browser APIs if needed
if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserverMock;
}