<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { validateNonogramName } from '../api/client';
    import { logger } from '../utils/logger';
    
    // Props
    export let currentName: string = '';
    export let isEditing: boolean = false;
    
    // Local state
    let nonogramName: string = currentName;
    let nameError: string = '';
    let isSaving: boolean = false;
    
    // Create event dispatcher
    const dispatch = createEventDispatcher<{
        save: string;
        cancel: void;
    }>();
    
    // Validate the nonogram name
    function validateName(): boolean {
        const validation = validateNonogramName(nonogramName);
        if (!validation.valid) {
            nameError = validation.message || 'Invalid name';
            return false;
        }
        
        nameError = '';
        return true;
    }
    
    // Handle form submission
    function handleSubmit(event: Event) {
        event.preventDefault();
        
        if (validateName()) {
            isSaving = true;
            dispatch('save', nonogramName);
        }
    }
    
    // Handle cancellation
    function handleCancel() {
        dispatch('cancel');
    }
</script>

<div class="save-form">
    <h3>{isEditing ? 'Save Changes to Nonogram' : 'Save New Nonogram'}</h3>
    
    <form on:submit={handleSubmit}>
        <div class="form-row">
            <label for="nonogram-name">Nonogram Name:</label>
            <input 
                id="nonogram-name" 
                type="text" 
                bind:value={nonogramName}
                on:input={validateName}
                maxlength="20"
                placeholder="Enter a name (max 20 characters)"
                disabled={isSaving}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
            />
            {#if nameError}
                <p id="name-error" class="error-message">{nameError}</p>
            {/if}
            <p class="help-text">Only letters, numbers, spaces, and basic punctuation are allowed.</p>
        </div>
        
        <div class="form-actions">
            <button type="submit" disabled={isSaving || !!nameError}>
                {isSaving ? 'Saving...' : 'Save Nonogram'}
            </button>
            <button type="button" on:click={handleCancel} disabled={isSaving}>
                Cancel
            </button>
        </div>
    </form>
</div>

<style>
    .save-form {
        background: linear-gradient(145deg, var(--bg-primary), var(--bg-secondary));
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    
    h3 {
        color: var(--text-primary);
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.3rem;
    }
    
    .form-row {
        margin-bottom: 15px;
    }
    
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        box-shadow: 0 1px 2px var(--shadow-color);
        transition: all 0.2s;
    }
    
    input:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
    }
    
    input[aria-invalid="true"] {
        border-color: #e53e3e;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.2);
    }
    
    .error-message {
        color: #e53e3e;
        font-size: 0.9rem;
        margin: 5px 0;
    }
    
    .help-text {
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin: 5px 0;
    }
    
    .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    button[type="submit"] {
        background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
        color: white;
        flex-grow: 1;
    }
    
    button[type="button"] {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    
    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px var(--shadow-color);
    }
    
    button[type="button"]:hover:not(:disabled) {
        background-color: var(--bg-secondary);
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style> 