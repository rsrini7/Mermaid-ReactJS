import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import App from './App';

// Fix the mermaid mock to include a default export
vi.mock('mermaid', () => {
  const mermaidMock = {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg>Test SVG</svg>' })
  };
  
  return {
    default: mermaidMock,
    ...mermaidMock
  };
});

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders the app header', () => {
    render(<App />);
    expect(screen.getByText('Mermaid Diagram Generator')).toBeInTheDocument();
  });

  test('renders template selector', () => {
    render(<App />);
    expect(screen.getByLabelText('Select Template:')).toBeInTheDocument();
  });

  test('renders theme toggle', () => {
    render(<App />);
    const themeToggle = screen.getByRole('checkbox');
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders input and output sections', () => {
    render(<App />);
    expect(screen.getByText('Mermaid Syntax')).toBeInTheDocument();
    expect(screen.getByText('Rendered Diagram')).toBeInTheDocument();
  });

  test('changes theme when toggle is clicked', () => {
    render(<App />);
    const themeToggle = screen.getByRole('checkbox');
    
    // Initially light theme
    const appContainer = document.querySelector('.app-container');
    expect(appContainer).toHaveAttribute('data-theme', 'light');
    
    // Click to change to dark theme
    fireEvent.click(themeToggle);
    expect(appContainer).toHaveAttribute('data-theme', 'dark');
    
    // Click again to change back to light theme
    fireEvent.click(themeToggle);
    expect(appContainer).toHaveAttribute('data-theme', 'light');
  });

  test('updates mermaid code when textarea changes', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Enter your Mermaid diagram syntax here...');
    
    fireEvent.change(textarea, { target: { value: 'graph TD\nA-->B' } });
    
    expect(textarea.value).toBe('graph TD\nA-->B');
  });

  test('opens editor popup when "Open Editor" button is clicked', () => {
    render(<App />);
    const openEditorButton = screen.getByText('Open Editor');
    
    fireEvent.click(openEditorButton);
    
    expect(screen.getByText('Edit Mermaid Syntax')).toBeInTheDocument();
  });

  test('closes editor popup when "Close Without Saving" button is clicked', () => {
    render(<App />);
    
    // Open the popup
    fireEvent.click(screen.getByText('Open Editor'));
    expect(screen.getByText('Edit Mermaid Syntax')).toBeInTheDocument();
    
    // Close the popup
    fireEvent.click(screen.getByText('Close Without Saving'));
    
    // Check that the popup is no longer in the document
    expect(screen.queryByText('Edit Mermaid Syntax')).not.toBeInTheDocument();
  });

  test('renders diagram when "Render Diagram" button is clicked', async () => {
    const { container } = render(<App />);
    
    const renderButton = screen.getByText('Render Diagram');
    fireEvent.click(renderButton);
    
    // Wait for the rendering to complete
    await waitFor(() => {
      expect(container.querySelector('.mermaid-output')).not.toBeNull();
    });
  });

  test('updates export settings when input values change', () => {
    render(<App />);
    
    const widthInput = screen.getByLabelText('Width:');
    const heightInput = screen.getByLabelText('Height:');
    const scaleInput = screen.getByLabelText('Scale:');
    
    fireEvent.change(widthInput, { target: { value: '1500' } });
    fireEvent.change(heightInput, { target: { value: '1000' } });
    fireEvent.change(scaleInput, { target: { value: '3' } });
    
    expect(widthInput.value).toBe('1500');
    expect(heightInput.value).toBe('1000');
    expect(scaleInput.value).toBe('3');
  });
});
