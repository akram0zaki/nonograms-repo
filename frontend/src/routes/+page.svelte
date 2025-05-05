<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import NonogramSelector from '$lib/components/NonogramSelector.svelte';
    import NonogramGrid from '$lib/components/NonogramGrid.svelte';
    import NonogramClues from '$lib/components/NonogramClues.svelte';
    import StatusBar from '$lib/components/StatusBar.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    
    import { getNonogramByName, createNonogram } from '$lib/api/client';
    import type { Nonogram } from '$lib/api/client';
    
    import {
        currentNonogram,
        appMode,
        isDirty,
        statusMessage,
        editorBoardState,
        playBoardState,
        newGridRows,
        newGridCols,
        calculateDescriptors,
        initializePlayBoardState,
        initializeEditorBoardState,
        initializeNewBoard,
        togglePlayCell,
        toggleEditCell,
    } from '$lib/stores/nonogramStore';
    
    // Create local references
    let currentNonogramValue: Nonogram | null;
    let editorBoardStateValue: boolean[][];
    let playBoardStateValue: any[][]; // Using any for simplicity due to CellState typing
    let appModeValue: string;
    let isDirtyValue: boolean;
    let newGridRowsValue: number;
    let newGridColsValue: number;
    
    // Subscribe to stores
    currentNonogram.subscribe(value => currentNonogramValue = value);
    editorBoardState.subscribe(value => editorBoardStateValue = value);
    playBoardState.subscribe(value => playBoardStateValue = value);
    appMode.subscribe(value => appModeValue = value);
    isDirty.subscribe(value => isDirtyValue = value);
    newGridRows.subscribe(value => newGridRowsValue = value);
    newGridCols.subscribe(value => newGridColsValue = value);
    
    // Calculated values
    $: currentDescriptors = appModeValue === 'edit' || appModeValue === 'create' 
        ? calculateDescriptors(editorBoardStateValue)
        : currentNonogramValue?.descriptors || { rows: [], columns: [] };
    
    // Prevent accidental tab/window close with unsaved changes
    onMount(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirtyValue) {
                e.preventDefault();
                e.returnValue = ''; // This is required for Chrome
                return '';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    });
    
    // Handle nonogram selection
    async function handleNonogramSelect(event: CustomEvent<string>) {
        const name = event.detail;
        
        if (isDirtyValue) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to load a different nonogram?');
            if (!confirmed) return;
        }
        
        try {
            appMode.set('loading');
            statusMessage.set(`Loading ${name}...`);
            
            console.log(`[DEBUG] Loading nonogram: ${name}`);
            const nonogram = await getNonogramByName(name);
            console.log('[DEBUG] Loaded nonogram data:', {
                name: nonogram.name,
                boardSize: `${nonogram.board.length}x${nonogram.board[0].length}`,
                sampleRow: JSON.stringify(nonogram.board[0]?.slice(0, 3))
            });
            
            // Set the current nonogram in the store
            currentNonogram.set(nonogram);
            
            // Default to view mode when loading a nonogram to show the solution
            appMode.set('view');
            isDirty.set(false);
            statusMessage.set(`Loaded ${name} successfully.`);
            
            setTimeout(() => {
                console.log('[DEBUG] Current state after loading:', {
                    currentNonogram: nonogram.name,
                    appMode: 'view',
                    boardSample: nonogram.board?.[0]?.slice(0, 3),
                    descriptors: {
                        rows: nonogram.descriptors.rows.length,
                        columns: nonogram.descriptors.columns.length
                    }
                });
            }, 100);
            
            // Clear message after a delay
            setTimeout(() => statusMessage.set(''), 2000);
        } catch (error) {
            console.error(`Error loading nonogram "${name}":`, error);
            statusMessage.set(`Error loading ${name}. Please try again.`);
            appMode.set('view');
        }
    }
    
    // Handle new puzzle
    function handleNewPuzzle() {
        if (isDirtyValue) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to create a new nonogram?');
            if (!confirmed) return;
        }
        
        // Switch to create mode
        appMode.set('create');
        
        // Reset dirty flag
        isDirty.set(false);
        
        // Clear current nonogram
        currentNonogram.set(null);
    }
    
    // Handle cell toggle in grid
    function handleCellToggle(event: CustomEvent) {
        const { row, col, isRightClick } = event.detail;
        
        if (appModeValue === 'play') {
            togglePlayCell(row, col, isRightClick);
        } else if (appModeValue === 'edit' || appModeValue === 'create') {
            toggleEditCell(row, col);
        }
    }
    
    // Handle create confirmation
    async function handleCreateConfirm() {
        if (newGridRowsValue < 3 || newGridRowsValue > 20 || newGridColsValue < 3 || newGridColsValue > 20) {
            alert('Grid dimensions must be between 3 and 20');
            return;
        }
        
        // Initialize a new empty board
        initializeNewBoard(newGridRowsValue, newGridColsValue);
        
        // Mark as dirty since we're in edit mode
        isDirty.set(true);
    }
    
    // Handle edit mode
    function handleEditMode() {
        if (!currentNonogramValue) return;
        
        // Initialize editor board with current nonogram
        initializeEditorBoardState(currentNonogramValue);
        
        // Switch to edit mode
        appMode.set('edit');
    }
    
    // Handle save (for now, we're not implementing actual saving to backend)
    async function handleSave() {
        try {
            statusMessage.set('Processing...');
            
            if (appModeValue === 'create' || appModeValue === 'edit') {
                const descriptors = calculateDescriptors(editorBoardStateValue);
                const name = currentNonogramValue?.name || 'New Nonogram';
                
                // Create a nonogram object
                const nonogram: Omit<Nonogram, 'descriptors'> = {
                    name,
                    board: editorBoardStateValue
                };
                
                // In a future version, this would save to the backend
                // For now, just calculate descriptors and update local state
                const updatedNonogram = await createNonogram(nonogram);
                
                // Update the current nonogram
                currentNonogram.set(updatedNonogram);
                
                // Clear dirty flag
                isDirty.set(false);
                
                statusMessage.set('Nonogram processed successfully! (Note: Not saved to backend in v1.0)');
                setTimeout(() => statusMessage.set(''), 3000);
            }
        } catch (error) {
            console.error('Error saving nonogram:', error);
            statusMessage.set('Error processing nonogram. Please try again.');
        }
    }
</script>

<svelte:head>
    <title>Nonogram Editor</title>
</svelte:head>

<div class="app-container">
    <header>
        <h1>Nonogram Editor</h1>
        <ThemeToggle />
    </header>
    
    <main>
        <!-- Status Bar -->
        <StatusBar currentNonogramName={currentNonogramValue?.name || ''} />
        
        <!-- Mode Toggle Buttons -->
        {#if currentNonogramValue}
            <div class="mode-buttons">
                <span>Mode:</span>
                <button 
                    class={appModeValue === 'view' ? 'active' : ''} 
                    on:click={() => appMode.set('view')}
                >
                    View
                </button>
                <button 
                    class={appModeValue === 'play' ? 'active' : ''} 
                    on:click={() => {
                        // Ensure we initialize the play board when switching to play mode
                        if (appModeValue !== 'play' && currentNonogramValue) {
                            console.log('[DEBUG] Initializing play state before switching to play mode');
                            initializePlayBoardState(currentNonogramValue);
                        }
                        appMode.set('play');
                    }}
                >
                    Play
                </button>
                <button 
                    class={appModeValue === 'edit' ? 'active' : ''} 
                    on:click={handleEditMode}
                >
                    Edit
                </button>
                <button 
                    class={appModeValue === 'create' ? 'active' : ''} 
                    on:click={() => appMode.set('create')}
                >
                    Create
                </button>
            </div>
        {/if}
        
        <!-- Controls Bar -->
        <div class="controls-bar">
            <NonogramSelector 
                on:select={handleNonogramSelect}
                on:new={handleNewPuzzle}
            />
        </div>
        
        <!-- Create Form (only visible in create mode) -->
        {#if appModeValue === 'create' && !editorBoardStateValue.length}
            <div class="create-form">
                <h3>Create New Nonogram</h3>
                <div class="form-row">
                    <label for="rows">Rows:</label>
                    <input 
                        id="rows" 
                        type="number" 
                        min="3" 
                        max="20" 
                        bind:value={newGridRowsValue}
                    />
                </div>
                <div class="form-row">
                    <label for="cols">Columns:</label>
                    <input 
                        id="cols" 
                        type="number" 
                        min="3" 
                        max="20" 
                        bind:value={newGridColsValue}
                    />
                </div>
                <button on:click={handleCreateConfirm}>Create Grid</button>
            </div>
        {/if}
        
        <!-- Edit/Create Actions -->
        {#if (appModeValue === 'edit' || (appModeValue === 'create' && editorBoardStateValue.length > 0)) && isDirtyValue}
            <div class="edit-actions">
                <button on:click={handleSave}>Process Nonogram</button>
                <p class="note">Note: In v1.0, nonograms are not saved to the backend.</p>
            </div>
        {/if}
        
        <!-- Nonogram Display Area -->
        {#if (currentNonogramValue || (appModeValue === 'create' && editorBoardStateValue.length > 0)) && appModeValue !== 'loading'}
            <div class="nonogram-area">
                <div class="nonogram-container">
                    <!-- Clues -->
                    <NonogramClues 
                        rowClues={currentDescriptors.rows} 
                        colClues={currentDescriptors.columns} 
                    />
                    
                    <!-- Grid -->
                    {#if appModeValue === 'play'}
                        <NonogramGrid 
                            board={playBoardStateValue} 
                            mode={appModeValue}
                            on:cellToggle={handleCellToggle}
                        />
                    {:else if appModeValue === 'edit'}
                        <NonogramGrid 
                            board={editorBoardStateValue} 
                            mode={appModeValue}
                            on:cellToggle={handleCellToggle}
                        />
                    {:else if appModeValue === 'create' && editorBoardStateValue.length > 0}
                        <NonogramGrid 
                            board={editorBoardStateValue} 
                            mode="create"
                            on:cellToggle={handleCellToggle}
                        />
                    {:else if appModeValue === 'view' && currentNonogramValue}
                        <NonogramGrid 
                            board={currentNonogramValue.board} 
                            mode="view"
                        />
                    {/if}
                </div>
            </div>
        {:else if appModeValue === 'loading'}
            <div class="loading">
                <p>Loading...</p>
            </div>
        {/if}
    </main>
    
    <footer>
        <p>© 2025 Nonogram Editor - Version 1.0</p>
    </footer>
</div>

<style>
    .app-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
    }
    
    header {
        text-align: center;
        margin-bottom: 30px;
        position: relative;
    }
    
    h1 {
        color: var(--text-primary);
        font-size: 2.5rem;
        margin: 0;
        padding: 15px 0;
        text-shadow: 1px 1px 2px var(--shadow-color);
        position: relative;
        display: inline-block;
    }
    
    h1::after {
        content: '';
        position: absolute;
        width: 60%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        bottom: 0;
        left: 20%;
    }
    
    main {
        background-color: var(--bg-secondary);
        border-radius: 12px;
        box-shadow: 0 4px 12px var(--shadow-color);
        padding: 25px;
        position: relative;
    }
    
    .controls-bar {
        margin-bottom: 20px;
        border-radius: 8px;
        background-color: var(--bg-primary);
        padding: 15px;
        box-shadow: 0 2px 5px var(--shadow-color);
    }
    
    .nonogram-area {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        position: relative;
    }
    
    .nonogram-container {
        display: grid;
        grid-template-areas:
            "corner columns"
            "rows grid";
        grid-template-columns: auto 1fr;
        grid-template-rows: auto 1fr;
        width: auto;
        overflow: visible;
        background-color: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 10px;
        padding: 15px;
        gap: 0;
        box-shadow: 0 3px 8px var(--shadow-color);
    }
    
    .mode-buttons {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 15px 0;
        padding: 12px;
        background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
        border-radius: 10px;
        box-shadow: 0 2px 5px var(--shadow-color);
    }
    
    .mode-buttons span {
        font-weight: bold;
        margin-right: 8px;
        color: var(--text-primary);
    }
    
    .mode-buttons button {
        padding: 8px 20px;
        border: none;
        border-radius: 8px;
        background-color: var(--bg-secondary);
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
        box-shadow: 0 1px 3px var(--shadow-color);
    }
    
    .mode-buttons button:hover {
        background-color: var(--accent-secondary);
        color: white;
        transform: translateY(-1px);
    }
    
    .mode-buttons button.active {
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        color: white;
        font-weight: 600;
        box-shadow: 0 2px 5px rgba(74, 144, 226, 0.3);
    }
    
    .create-form {
        background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 25px;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    
    .create-form h3 {
        color: var(--text-primary);
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.3rem;
    }
    
    .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .form-row label {
        width: 100px;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .form-row input {
        width: 100px;
        padding: 10px 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        box-shadow: 0 1px 2px var(--shadow-color);
        transition: all 0.2s;
    }
    
    .form-row input:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
    }
    
    .create-form button, .edit-actions button, .controls-bar button {
        padding: 10px 20px;
        background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
        box-shadow: 0 2px 5px var(--shadow-color);
    }
    
    .create-form button:hover, .edit-actions button:hover, .controls-bar button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px var(--shadow-color);
    }
    
    .edit-actions {
        margin: 20px 0;
        padding: 15px;
        background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 5px var(--shadow-color);
    }
    
    .note {
        color: var(--text-secondary);
        font-style: italic;
        font-size: 0.9em;
        margin: 0 15px;
    }
    
    .loading {
        text-align: center;
        padding: 50px;
        font-size: 1.3em;
        color: var(--text-primary);
    }
    
    .loading::after {
        content: "...";
        animation: dots 1.5s infinite;
    }
    
    @keyframes dots {
        0%, 20% { content: "."; }
        40%, 60% { content: ".."; }
        80%, 100% { content: "..."; }
    }
    
    footer {
        margin-top: 30px;
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.9em;
        padding: 20px 0;
    }
    
    footer p {
        position: relative;
        display: inline-block;
    }
    
    footer p::before, footer p::after {
        content: "•";
        color: var(--accent-primary);
        margin: 0 10px;
        opacity: 0.7;
    }
</style> 