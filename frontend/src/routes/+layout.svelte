<script>
    import { theme } from '$lib/stores/themeStore';
    import { onMount } from 'svelte';
    
    // Initialize theme on mount
    onMount(() => {
        // Apply theme class on initial load
        document.body.classList.add($theme === 'dark' ? 'dark-theme' : 'light-theme');
    });
</script>

<slot></slot>

<style>
    :global(:root) {
        /* Light theme variables */
        --bg-primary: #f5f7fa;
        --bg-secondary: #ffffff;
        --text-primary: #333333;
        --text-secondary: #666666;
        --accent-primary: #4a90e2;
        --accent-secondary: #63b3ed;
        --border-color: #e2e8f0;
        --shadow-color: rgba(0, 0, 0, 0.1);
        --cell-filled: #2d3748;
        --cell-empty: #ffffff;
        --cell-marked: #e53e3e;
    }
    
    :global(.dark-theme) {
        /* Dark theme variables with improved contrast */
        --bg-primary: #1a202c;
        --bg-secondary: #2d3748;
        --text-primary: #f0f4f8;
        --text-secondary: #cbd5e0;
        --accent-primary: #63b3ed;
        --accent-secondary: #90cdf4;
        --border-color: #4a5568;
        --shadow-color: rgba(0, 0, 0, 0.4);
        --cell-filled: #63b3ed;
        --cell-empty: #2d3748;
        --cell-marked: #fc8181;
    }
    
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    :global(*) {
        box-sizing: border-box;
    }
    
    :global(button) {
        cursor: pointer;
    }
    
    :global(h1, h2, h3, h4, h5, h6) {
        margin-top: 0;
    }
</style> 