import { writable, derived } from 'svelte/store';
import type { Nonogram } from '../api/client';

export type AppMode = 'view' | 'edit' | 'play' | 'create' | 'loading';
export type CellState = 'empty' | 'filled' | 'marked';

// Initialize the stores
export const currentNonogram = writable<Nonogram | null>(null);
export const availableNonograms = writable<string[]>([]);
export const searchResults = writable<string[]>([]);
export const appMode = writable<AppMode>('view');
export const isDirty = writable<boolean>(false);

// For the create mode
export const newGridRows = writable<number>(5);
export const newGridCols = writable<number>(5);

// For the editor mode
export const editorBoardState = writable<boolean[][]>([]);

// For the play mode
export const playBoardState = writable<CellState[][]>([]);

// Status message
export const statusMessage = writable<string>('');

// Computed store for determining if the puzzle has been solved
export const puzzleSolved = derived(
    [currentNonogram, playBoardState],
    ([$currentNonogram, $playBoardState]) => {
        if (!$currentNonogram || !$playBoardState.length) return false;
        
        const { board } = $currentNonogram;
        
        // Check each cell to see if the filled cells match the solution
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                // If the solution has a filled cell but the player's board doesn't,
                // or vice versa, the puzzle is not solved
                if ((board[r][c] && $playBoardState[r][c] !== 'filled') ||
                    (!board[r][c] && $playBoardState[r][c] === 'filled')) {
                    return false;
                }
            }
        }
        
        return true;
    }
);

// Helper functions for the store

/**
 * Initialize the play board state based on the current nonogram
 */
export function initializePlayBoardState(nonogram: Nonogram): void {
    console.log('[DEBUG] initializePlayBoardState called with:', {
        nonogramName: nonogram.name,
        boardDimensions: `${nonogram.board.length}x${nonogram.board[0].length}`,
        sampleBoard: nonogram.board[0]?.slice(0, 3)
    });
    
    if (!nonogram.board || !Array.isArray(nonogram.board) || nonogram.board.length === 0) {
        console.error('[DEBUG] Invalid board data:', nonogram.board);
        playBoardState.set([]);
        return;
    }
    
    const rows = nonogram.board.length;
    const cols = nonogram.board[0].length;
    
    // Create an empty board of the same dimensions
    const emptyBoard: CellState[][] = [];
    
    for (let r = 0; r < rows; r++) {
        const row: CellState[] = [];
        for (let c = 0; c < cols; c++) {
            row.push('empty');
        }
        emptyBoard.push(row);
    }
    
    console.log('[DEBUG] Setting playBoardState to empty board:', {
        rows,
        cols,
        boardSample: emptyBoard[0]?.slice(0, 3)
    });
    
    playBoardState.set(emptyBoard);
}

/**
 * Initialize the editor board state based on the current nonogram
 */
export function initializeEditorBoardState(nonogram: Nonogram): void {
    // Create a deep copy of the current board
    const boardCopy = nonogram.board.map(row => [...row]);
    editorBoardState.set(boardCopy);
}

/**
 * Initialize a new empty editor board with the specified dimensions
 */
export function initializeNewBoard(rows: number, cols: number): void {
    const emptyBoard: boolean[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(false));
    
    editorBoardState.set(emptyBoard);
}

/**
 * Toggle a cell in play mode
 */
export function togglePlayCell(row: number, col: number, isRightClick: boolean = false): void {
    console.log('[DEBUG] togglePlayCell called:', { row, col, isRightClick });
    
    playBoardState.update(board => {
        // Safety check for invalid board structure
        if (!board || !Array.isArray(board) || board.length <= row || !board[row] || board[row].length <= col) {
            console.error('[DEBUG] Invalid board structure in togglePlayCell:', { board, row, col });
            return board; // Return unchanged if invalid
        }
        
        const newBoard = [...board];
        
        // Create a deep copy of the row
        newBoard[row] = [...newBoard[row]];
        
        const oldValue = newBoard[row][col];
        
        if (isRightClick) {
            // Right-click cycles between: empty -> marked -> empty
            newBoard[row][col] = newBoard[row][col] === 'empty' ? 'marked' : 'empty';
        } else {
            // Left-click cycles between: empty -> filled -> empty
            newBoard[row][col] = newBoard[row][col] === 'empty' ? 'filled' : 'empty';
        }
        
        console.log(`[DEBUG] Cell toggled: [${row},${col}] ${oldValue} -> ${newBoard[row][col]}`);
        
        return newBoard;
    });
}

/**
 * Toggle a cell in edit mode
 */
export function toggleEditCell(row: number, col: number): void {
    editorBoardState.update(board => {
        const newBoard = [...board];
        
        // Create a deep copy of the row
        newBoard[row] = [...newBoard[row]];
        
        // Toggle the cell
        newBoard[row][col] = !newBoard[row][col];
        
        return newBoard;
    });
    
    // Mark the editor state as dirty
    isDirty.set(true);
}

/**
 * Calculate descriptors from a board
 */
export function calculateDescriptors(board: boolean[][]) {
    if (!board.length || !board[0].length) {
        return { rows: [], columns: [] };
    }
    
    const rows = board.length;
    const cols = board[0].length;
    
    // Calculate row descriptors
    const rowDescriptors = board.map(row => {
        const descriptors = [];
        let count = 0;
        
        for (let c = 0; c < row.length; c++) {
            if (row[c]) {
                count++;
            } else if (count > 0) {
                descriptors.push(count);
                count = 0;
            }
        }
        
        // Handle case where sequence continues to the end of the row
        if (count > 0) {
            descriptors.push(count);
        }
        
        // If row is empty, add a 0
        if (descriptors.length === 0) {
            descriptors.push(0);
        }
        
        return descriptors;
    });
    
    // Calculate column descriptors
    const colDescriptors = [];
    
    for (let c = 0; c < cols; c++) {
        const descriptors = [];
        let count = 0;
        
        for (let r = 0; r < rows; r++) {
            if (board[r][c]) {
                count++;
            } else if (count > 0) {
                descriptors.push(count);
                count = 0;
            }
        }
        
        // Handle case where sequence continues to the end of the column
        if (count > 0) {
            descriptors.push(count);
        }
        
        // If column is empty, add a 0
        if (descriptors.length === 0) {
            descriptors.push(0);
        }
        
        colDescriptors.push(descriptors);
    }
    
    return {
        rows: rowDescriptors,
        columns: colDescriptors
    };
} 