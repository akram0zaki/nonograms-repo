<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { getNonogramList, searchNonogramsByClue } from '../api/client';
    import { availableNonograms, searchResults, statusMessage } from '../stores/nonogramStore';
    
    // Create event dispatcher
    const dispatch = createEventDispatcher();
    
    // Local state
    let selectedNonogram: string = '';
    let searchQuery: string = '';
    let isSearching: boolean = false;
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;
    let availableNonogramsValue: string[] = [];
    let searchResultsValue: string[] = [];
    
    // Subscribe to stores
    availableNonograms.subscribe(value => availableNonogramsValue = value);
    searchResults.subscribe(value => searchResultsValue = value);
    
    // Fetch the list of available nonograms on mount
    onMount(async () => {
        try {
            statusMessage.set('Loading nonogram list...');
            const names = await getNonogramList();
            availableNonograms.set(names);
            
            // If there are nonograms available, select the first one by default
            if (names.length > 0) {
                selectedNonogram = names[0];
            }
            
            statusMessage.set('');
        } catch (error) {
            console.error('Error fetching nonogram list:', error);
            statusMessage.set('Error loading nonogram list. Please try again later.');
        }
    });
    
    // Handle nonogram selection
    function handleSelect() {
        if (selectedNonogram) {
            dispatch('select', selectedNonogram);
        }
    }
    
    // Handle search input with debounce
    function handleSearchInput() {
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set a new timeout to debounce the search
        searchTimeout = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                try {
                    isSearching = true;
                    statusMessage.set('Searching...');
                    
                    const matches = await searchNonogramsByClue(searchQuery);
                    searchResults.set(matches);
                    
                    if (matches.length > 0) {
                        selectedNonogram = matches[0];
                        statusMessage.set(`Found ${matches.length} matching nonogram(s)`);
                    } else {
                        statusMessage.set('No matches found');
                    }
                } catch (error) {
                    console.error('Error searching nonograms:', error);
                    statusMessage.set('Error during search. Please try again.');
                } finally {
                    isSearching = false;
                }
            } else {
                // Clear search results if the query is empty
                searchResults.set([]);
                statusMessage.set('');
            }
        }, 500); // 500ms debounce delay
    }
    
    // Handle new puzzle button
    function handleNewPuzzle() {
        dispatch('new');
    }

    // Handle selecting a nonogram from search results
    function handleSearchResultSelect(name: string) {
        selectedNonogram = name;
    }

    // Handle keyboard navigation for search results
    function handleKeyDown(event: KeyboardEvent, name: string) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectedNonogram = name;
        }
    }
</script>

<div class="selector-container">
    <div class="selector-row">
        <label for="nonogram-select">Load:</label>
        <select 
            id="nonogram-select" 
            bind:value={selectedNonogram} 
            disabled={availableNonogramsValue.length === 0}
        >
            {#if availableNonogramsValue.length === 0}
                <option value="">No nonograms available</option>
            {:else}
                {#each availableNonogramsValue as name}
                    <option value={name}>{name}</option>
                {/each}
            {/if}
        </select>
        <button on:click={handleSelect} disabled={!selectedNonogram}>Load Selected</button>
    </div>
    
    <div class="selector-row">
        <label for="search-input">Search by Clues:</label>
        <input 
            id="search-input" 
            type="text" 
            placeholder="Enter clue (e.g., '1,2,3' or '1 2 3')" 
            bind:value={searchQuery} 
            on:input={handleSearchInput}
            disabled={isSearching}
        />
    </div>
    
    {#if searchResultsValue.length > 0}
        <div class="search-results">
            <h4 id="search-results-heading">Search Results:</h4>
            <ul role="listbox" aria-labelledby="search-results-heading">
                {#each searchResultsValue as name}
                    <li 
                        role="option"
                        aria-selected={selectedNonogram === name}
                        class:selected={selectedNonogram === name} 
                        tabindex="0"
                        on:click={() => handleSearchResultSelect(name)}
                        on:keydown={(e) => handleKeyDown(e, name)}
                    >
                        {name}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
    
    <div class="selector-row">
        <button on:click={handleNewPuzzle}>New Puzzle</button>
    </div>
</div>

<style>
    .selector-container {
        padding: 10px;
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .selector-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;
    }
    
    label {
        font-weight: bold;
        min-width: 100px;
    }
    
    select, input {
        flex-grow: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    button {
        padding: 8px 16px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    
    button:hover {
        background-color: #3a80d2;
    }
    
    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
    
    .search-results {
        margin-top: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        background-color: white;
    }
    
    .search-results h4 {
        margin-top: 0;
        margin-bottom: 8px;
    }
    
    .search-results ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    
    .search-results li {
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 3px;
    }
    
    .search-results li:hover {
        background-color: #f0f0f0;
    }
    
    .search-results li.selected {
        background-color: #e2f0ff;
        font-weight: bold;
    }
</style> 