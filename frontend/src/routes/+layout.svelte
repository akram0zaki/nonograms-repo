<script>
    // Global layout
</script>

<slot></slot>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #f5f5f5;
        color: #333;
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