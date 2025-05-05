import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ThemeToggle from '../ThemeToggle.svelte';
import { theme, toggleTheme } from '../../stores/themeStore';
import { get } from 'svelte/store';

// Mock the theme store
vi.mock('../../stores/themeStore', () => {
  const { writable } = require('svelte/store');
  const mockTheme = writable('dark');
  return {
    theme: mockTheme,
    toggleTheme: vi.fn(() => {
      mockTheme.update((current: string) => current === 'light' ? 'dark' : 'light');
    })
  };
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset theme to dark
    theme.set('dark');
    vi.clearAllMocks();
  });

  it('should render with sun icon when in dark theme', () => {
    theme.set('dark');
    const { container } = render(ThemeToggle);
    
    // Check if the sun icon is rendered (shown when in dark theme to switch to light)
    expect(container.querySelector('svg circle')).not.toBeNull();
  });
  
  it('should render with moon icon when in light theme', () => {
    theme.set('light');
    const { container } = render(ThemeToggle);
    
    // Check if the moon icon is rendered (shown when in light theme to switch to dark)
    expect(container.querySelector('svg path')).not.toBeNull();
  });

  it('should have aria-label for switching to light theme when in dark mode', () => {
    theme.set('dark');
    const { getByRole } = render(ThemeToggle);
    
    const button = getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
  });
  
  it('should have aria-label for switching to dark theme when in light mode', () => {
    theme.set('light');
    const { getByRole } = render(ThemeToggle);
    
    expect(getByRole('button').getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('should call toggleTheme when clicked', async () => {
    const { getByRole } = render(ThemeToggle);
    const button = getByRole('button');
    
    // Current theme is dark
    expect(get(theme)).toBe('dark');
    
    // Click the toggle button
    await fireEvent.click(button);
    
    // Verify toggleTheme was called
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    
    // Verify theme was toggled to light
    expect(get(theme)).toBe('light');
    
    // Click the toggle button again
    await fireEvent.click(button);
    
    // Verify toggleTheme was called again
    expect(toggleTheme).toHaveBeenCalledTimes(2);
    
    // Verify theme was toggled back to dark
    expect(get(theme)).toBe('dark');
  });
}); 