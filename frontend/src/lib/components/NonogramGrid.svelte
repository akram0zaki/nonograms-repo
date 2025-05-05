<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { AppMode, CellState } from '../stores/nonogramStore';
    
    // Props
    export let board: boolean[][] | CellState[][] = [];
    export let mode: AppMode = 'view';
    
    // Create event dispatcher
    const dispatch = createEventDispatcher();
    
    // These keep track of the drag state globally
    let dragState = {
        isMouseDown: false,
        isRightMouseDown: false,
        lastCellToggled: null as { row: number, col: number } | null,
        initialCellValue: null as boolean | CellState | null // Store initial cell value for consistent dragging
    };
    
    // Grid dimensions
    $: rows = board.length;
    $: cols = board.length > 0 ? board[0].length : 0;
    
    // Handle mouse events
    function handleMouseDown(row: number, col: number, event: MouseEvent) {
        event.preventDefault(); // Prevent default browser behavior
        
        if (mode === 'play' || mode === 'edit' || mode === 'create') {
            // Store the initial cell value for consistent dragging
            dragState.initialCellValue = board[row][col];
            
            if (event.button === 2) { // Right click
                dragState.isRightMouseDown = true;
                dragState.isMouseDown = false;
                dragState.lastCellToggled = { row, col };
                dispatch('cellToggle', { row, col, isRightClick: true });
            } else { // Left click
                dragState.isMouseDown = true;
                dragState.isRightMouseDown = false;
                dragState.lastCellToggled = { row, col };
                dispatch('cellToggle', { row, col, isRightClick: false });
            }
        }
    }
    
    function handleMouseUp() {
        dragState.isMouseDown = false;
        dragState.isRightMouseDown = false;
        dragState.lastCellToggled = null;
        dragState.initialCellValue = null;
    }
    
    function handleMouseOver(row: number, col: number) {
        if ((dragState.isMouseDown || dragState.isRightMouseDown) && 
            (mode === 'play' || mode === 'edit' || mode === 'create') &&
            dragState.lastCellToggled) {
            
            // Only toggle if we're moving to a new cell
            if (dragState.lastCellToggled.row !== row || dragState.lastCellToggled.col !== col) {
                dragState.lastCellToggled = { row, col };
                
                // In paint mode, we want to apply the same action to all cells
                // For Play mode - Apply consistent action based on initial state
                if (mode === 'play') {
                    const isMarkedMode = dragState.isRightMouseDown;
                    const currentCellValue = board[row][col] as CellState;
                    
                    // Only dispatch if the cell isn't already in the desired state
                    if ((isMarkedMode && currentCellValue !== 'marked') || 
                        (!isMarkedMode && currentCellValue !== 'filled')) {
                        dispatch('cellToggle', { row, col, isRightClick: isMarkedMode });
                    }
                } 
                // For Edit/Create mode - Always set to the opposite of initial value
                else if (mode === 'edit' || mode === 'create') {
                    const initialValue = dragState.initialCellValue as boolean;
                    const currentValue = board[row][col] as boolean;
                    
                    // Only toggle if current cell state doesn't match desired state
                    if (currentValue === initialValue) {
                        dispatch('cellToggle', { row, col, isRightClick: false });
                    }
                }
            }
        }
    }
    
    // Handle keyboard events for accessibility
    function handleKeyDown(row: number, col: number, event: KeyboardEvent) {
        if (mode === 'play' || mode === 'edit' || mode === 'create') {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                dispatch('cellToggle', { row, col, isRightClick: event.shiftKey });
            } else if (event.key.startsWith('Arrow')) {
                event.preventDefault();
                
                // Calculate new position based on arrow key
                let newRow = row;
                let newCol = col;
                
                switch (event.key) {
                    case 'ArrowUp': newRow = Math.max(0, row - 1); break;
                    case 'ArrowDown': newRow = Math.min(rows - 1, row + 1); break;
                    case 'ArrowLeft': newCol = Math.max(0, col - 1); break;
                    case 'ArrowRight': newCol = Math.min(cols - 1, col + 1); break;
                }
                
                // Focus the new cell
                const newCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`) as HTMLElement;
                if (newCell) newCell.focus();
            }
        }
    }
    
    // Handle focus event for accessibility
    function handleFocus(row: number, col: number) {
        // This function is needed to pair with mouseover for accessibility
    }
    
    // Prevent context menu on right-click
    function handleContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
    
    // Determine cell class based on mode and state
    function getCellClass(cellValue: boolean | CellState, rowIndex: number, colIndex: number) {
        let classes = 'cell';
        
        // Add border classes for grid lines
        if ((rowIndex + 1) % 5 === 0 && rowIndex < rows - 1) classes += ' border-bottom';
        if ((colIndex + 1) % 5 === 0 && colIndex < cols - 1) classes += ' border-right';
        
        // Add cell state classes based on mode
        if (mode === 'view') {
            if (cellValue === true) classes += ' filled';
        } else if (mode === 'edit' || mode === 'create') {
            if (cellValue === true) classes += ' filled';
        } else if (mode === 'play') {
            if (cellValue === 'filled') classes += ' filled';
            else if (cellValue === 'marked') classes += ' marked';
        }
        
        console.log(`[DEBUG] Cell class for [${rowIndex},${colIndex}]: ${classes}, value=${JSON.stringify(cellValue)}, mode=${mode}`);
        
        return classes;
    }
    
    // For debugging
    function logBoardStructure() {
        console.log('[DEBUG] Grid component:', {
            boardType: typeof board,
            isBoardArray: Array.isArray(board),
            rows,
            cols,
            mode,
            sampleCells: board?.length > 0 ? board[0]?.slice(0, 3) : [],
            cellValueTypes: board?.length > 0 ? board[0]?.slice(0, 3).map(cell => typeof cell) : []
        });
    }
    
    $: {
        // Log the board structure whenever it changes
        if (board) {
            logBoardStructure();
        }
    }

    // Add a function to display cell content for debugging
    function getCellDebugText(cell: any): string {
        if (cell === true) return 'T';
        if (cell === false) return 'F';
        if (cell === 'filled') return 'F';
        if (cell === 'marked') return 'M';
        if (cell === 'empty') return 'E';
        return '?';
    }

    // For determining aria attributes
    function getCellAriaState(cellValue: boolean | CellState, mode: AppMode): string {
        if (mode === 'view') {
            return cellValue === true ? 'filled' : 'empty';
        } else if (mode === 'edit' || mode === 'create') {
            return cellValue === true ? 'filled' : 'empty';
        } else if (mode === 'play') {
            return cellValue as string;
        }
        return 'empty';
    }
</script>

<div 
    class="grid-container" 
    role="region" 
    aria-label="Nonogram puzzle grid"
    on:contextmenu|preventDefault={handleContextMenu}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
>
    {#if board && board.length > 0 && board[0].length > 0}
        <div 
            class="grid" 
            style="grid-template-columns: repeat({cols}, 25px); grid-template-rows: repeat({rows}, 25px);"
            role="grid"
            aria-rowcount={rows}
            aria-colcount={cols}
        >
            {#each board as row, rowIndex}
                <div class="grid-row" role="row" aria-rowindex={rowIndex + 1}>
                    {#each row as cell, colIndex}
                        <button 
                            type="button"
                            class={getCellClass(cell, rowIndex, colIndex)}
                            aria-label="Cell row {rowIndex + 1}, column {colIndex + 1}, {getCellAriaState(cell, mode)}"
                            aria-pressed={cell === true || cell === 'filled'}
                            aria-rowindex={rowIndex + 1}
                            aria-colindex={colIndex + 1}
                            tabindex="0"
                            on:mousedown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                            on:mouseover={() => handleMouseOver(rowIndex, colIndex)}
                            on:keydown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                            on:click|preventDefault
                            data-cell-value={typeof cell === 'boolean' ? (cell ? 'true' : 'false') : cell}
                            data-row={rowIndex}
                            data-col={colIndex}
                        >
                            {#if mode === 'play' && cell === 'marked'}
                                <span aria-hidden="true">×</span>
                            {/if}
                            <span class="debug-text">{getCellDebugText(cell)}</span>
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    {:else}
        <div class="grid-error" role="alert">No grid data available. Board length: {board ? board.length : 0}</div>
    {/if}
</div>

<style>
    .grid-container {
        grid-area: grid;
        overflow: visible;
        margin: 0;
        padding: 0;
        user-select: none;
    }
    
    .grid {
        display: grid;
        gap: 1px;
        background-color: var(--border-color);
        border: 2px solid var(--border-color);
        border-radius: 4px;
        box-shadow: 0 3px 6px var(--shadow-color);
    }
    
    .grid-row {
        display: contents;
    }
    
    .cell, button {
        width: 25px;
        height: 25px;
        background-color: var(--cell-empty);
        border: none;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        padding: 0;
        margin: 0;
        font-size: 1rem;
        position: relative;
        transition: all 0.15s ease;
        box-shadow: inset 0 0 0 1px var(--shadow-color);
    }
    
    button:focus {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--accent-primary), 0 0 0 1px rgba(74, 144, 226, 0.5);
        z-index: 1;
    }
    
    .cell:hover, button:hover {
        background-color: var(--accent-secondary);
        opacity: 0.8;
    }
    
    /* View/Edit/Create Mode - For boolean values (true/false) */
    .cell.filled {
        background-color: var(--cell-filled);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
    }
    
    /* Alternative selector for boolean true values */
    button[data-cell-value="true"] {
        background-color: var(--cell-filled);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
    }
    
    button[data-cell-value="true"]:hover,
    .filled:hover {
        background-color: var(--accent-primary) !important;
    }
    
    /* Play Mode - For CellState values ('empty', 'filled', 'marked') */
    button[data-cell-value="filled"] {
        background-color: var(--cell-filled);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
        transform: scale(0.95);
    }
    
    button[data-cell-value="filled"]:hover {
        background-color: var(--accent-primary);
    }
    
    button[data-cell-value="marked"] {
        background-color: var(--cell-empty);
    }
    
    button[data-cell-value="marked"] span {
        color: var(--cell-marked);
        font-size: 18px;
        font-weight: bold;
    }
    
    .border-bottom {
        border-bottom: 1px solid var(--border-color);
    }
    
    .border-right {
        border-right: 1px solid var(--border-color);
    }
    
    .grid-error {
        padding: 10px;
        color: var(--cell-marked);
        background-color: var(--bg-secondary);
        border-radius: 4px;
        border: 1px solid var(--cell-marked);
    }
    
    .debug-text {
        font-size: 8px;
        color: #999;
        position: absolute;
        top: 1px;
        left: 1px;
        opacity: 0.3;
        pointer-events: none;
    }
    
    @media (prefers-reduced-motion: no-preference) {
        button[data-cell-value="filled"], .cell.filled, button[data-cell-value="true"] {
            transition: background-color 0.2s ease, transform 0.1s ease;
        }
        
        button[data-cell-value="empty"]:active {
            transform: scale(0.9);
        }
    }
</style> 