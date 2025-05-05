/**
 * @jest-environment jsdom
 */
import { theme, toggleTheme } from '../themeStore';
import { get } from 'svelte/store';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock document.body
Object.defineProperty(document, 'body', {
    value: {
        classList: {
            add: jest.fn(),
            remove: jest.fn()
        }
    },
    writable: true
});

describe('themeStore', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        
        // Reset module state between tests
        theme.set('light');
    });

    test('should initialize with light theme by default', () => {
        // Re-import to force initialization with current localStorage state
        jest.resetModules();
        const { theme } = require('../themeStore');
        
        expect(get(theme)).toBe('light');
    });

    test('should use theme from localStorage if available', () => {
        // Set value in localStorage first
        localStorage.setItem('theme', 'dark');
        
        // Re-import to force initialization with current localStorage state
        jest.resetModules();
        const { theme } = require('../themeStore');
        
        expect(get(theme)).toBe('dark');
    });

    test('should update localStorage when theme changes', () => {
        // Start with light theme
        theme.set('light');
        
        // Change to dark theme
        theme.set('dark');
        
        // Check localStorage was updated
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('toggleTheme should switch between light and dark', () => {
        // Start with light theme
        theme.set('light');
        
        // Toggle to dark
        toggleTheme();
        expect(get(theme)).toBe('dark');
        
        // Toggle back to light
        toggleTheme();
        expect(get(theme)).toBe('light');
    });

    test('should update body classes when theme changes', () => {
        // Start with light theme
        theme.set('light');
        
        // Check that classList.add was called
        expect(document.body.classList.add).toHaveBeenCalledWith('light-theme');
        expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
        
        // Reset mocks
        jest.clearAllMocks();
        
        // Change to dark theme
        theme.set('dark');
        
        // Check that classList methods were called
        expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
        expect(document.body.classList.remove).toHaveBeenCalledWith('light-theme');
    });
}); 