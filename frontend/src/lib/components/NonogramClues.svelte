<script lang="ts">
    // Props
    export let rowClues: number[][] = [];
    export let colClues: number[][] = [];
    
    // Calculated max lengths
    $: maxRowClueLength = Math.max(...rowClues.map(row => row.length), 0);
    $: maxColClueLength = Math.max(...colClues.map(col => col.length), 0);
    
    // Debug logging
    $: {
        console.log('[DEBUG] Clues:', {
            rowClues,
            colClues,
            maxRowClueLength,
            maxColClueLength
        });
    }
</script>

<div class="clues-container">
    <!-- Top-left corner (empty space) -->
    <div class="top-left-corner"></div>
    
    <!-- Column clues (top) -->
    <div class="column-clues">
        {#each Array(maxColClueLength) as _, clueIdx}
            <div class="column-clue-row">
                {#each colClues as colClue}
                    <div class="clue-cell">
                        {#if clueIdx >= maxColClueLength - colClue.length}
                            {colClue[clueIdx - (maxColClueLength - colClue.length)]}
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    
    <!-- Row clues (left) -->
    <div class="row-clues">
        {#each rowClues as rowClue}
            <div class="row-clue">
                {#each Array(maxRowClueLength) as _, clueIdx}
                    <div class="clue-cell">
                        {#if clueIdx >= maxRowClueLength - rowClue.length}
                            {rowClue[clueIdx - (maxRowClueLength - rowClue.length)]}
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .clues-container {
        display: contents;
    }
    
    .top-left-corner {
        grid-area: corner;
        background-color: #f7fafc;
        border: 2px solid #4a5568;
        min-width: 25px;
        min-height: 25px;
        border-radius: 4px 0 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .top-left-corner::after {
        content: '⊞';
        color: #a0aec0;
        font-size: 16px;
        opacity: 0.5;
    }
    
    .column-clues {
        grid-area: columns;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        border-top: 2px solid #4a5568;
        border-right: 2px solid #4a5568;
        background-color: #f7fafc;
        border-radius: 0 4px 0 0;
    }
    
    .column-clue-row {
        display: flex;
        flex-direction: row;
        margin: 0;
        padding: 0;
    }
    
    .row-clues {
        grid-area: rows;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        border-left: 2px solid #4a5568;
        border-bottom: 2px solid #4a5568;
        background-color: #f7fafc;
        border-radius: 0 0 0 4px;
    }
    
    .row-clue {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        height: 25px;
    }
    
    .clue-cell {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        color: #4a5568;
        box-sizing: border-box;
        transition: all 0.2s;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    
    .clue-cell:not(:empty) {
        position: relative;
    }
    
    .clue-cell:not(:empty)::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        background-color: #e2e8f0;
        border-radius: 50%;
        z-index: -1;
        transition: transform 0.2s;
    }
    
    .clue-cell:not(:empty):hover::before {
        transform: scale(1.2);
        background-color: #cbd5e0;
    }
</style> 