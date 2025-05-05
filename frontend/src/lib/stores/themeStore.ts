import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Initialize theme from localStorage or default to dark
const storedTheme = browser ? localStorage.getItem('theme') as Theme : null;
const initialTheme: Theme = storedTheme || 'dark';

// Create the theme store
export const theme = writable<Theme>(initialTheme);

// Subscribe to theme changes and update localStorage and body class
if (browser) {
    theme.subscribe(value => {
        localStorage.setItem('theme', value);
        
        // Update document body with theme class
        if (value === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    });
}

// Toggle between light and dark themes
export function toggleTheme(): void {
    theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
} 