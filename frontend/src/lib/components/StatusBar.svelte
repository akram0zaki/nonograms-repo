<script lang="ts">
    import { appMode, statusMessage, puzzleSolved } from '../stores/nonogramStore';
    import type { AppMode } from '../stores/nonogramStore';
    
    // Props
    export let currentNonogramName: string = '';
    
    // Local state
    let appModeValue: AppMode;
    let statusMessageValue: string;
    let puzzleSolvedValue: boolean;
    
    // Subscribe to stores
    appMode.subscribe(value => appModeValue = value);
    statusMessage.subscribe(value => statusMessageValue = value);
    puzzleSolved.subscribe(value => puzzleSolvedValue = value);
</script>

<div class="status-bar">
    <div class="status-message">
        {#if puzzleSolvedValue}
            <div class="success-message">🎉 Puzzle Solved! Congratulations! 🎉</div>
        {:else if statusMessageValue}
            <div class="info-message">{statusMessageValue}</div>
        {:else}
            <div class="current-nonogram">
                {#if currentNonogramName}
                    Current: <span class="nonogram-name">{currentNonogramName}</span>
                {:else}
                    No nonogram loaded
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .status-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
        border: none;
        border-radius: 10px;
        margin-bottom: 15px;
        box-shadow: 0 2px 6px var(--shadow-color);
    }
    
    .status-message {
        flex-grow: 1;
    }
    
    .success-message {
        color: #2bb573; /* Success color is kept distinct for accessibility */
        font-weight: bold;
        font-size: 1.2em;
        text-shadow: 0 1px 1px var(--shadow-color);
        animation: pulse 1.5s infinite;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .success-message::before, .success-message::after {
        content: "🎉";
    }
    
    .info-message {
        color: var(--accent-primary);
        font-weight: 500;
    }
    
    .current-nonogram {
        font-size: 1.1em;
        color: var(--text-primary);
    }
    
    .nonogram-name {
        font-weight: 600;
        color: var(--accent-primary);
        border-bottom: 2px dotted var(--accent-secondary);
        padding-bottom: 2px;
    }
    
    @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1); }
    }
</style> 