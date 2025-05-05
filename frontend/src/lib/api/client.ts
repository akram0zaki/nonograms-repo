import { logger } from '../utils/logger';

// Define base URL for API calls
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Define interfaces to match backend types
export interface Nonogram {
    name: string;
    board: boolean[][];
    descriptors?: {
        rows: number[][];
        columns: number[][];
    };
}

export interface NonogramList {
    names: string[];
}

export interface NonogramSearchResult {
    matches: string[];
}

// Error response interface
interface ErrorResponse {
    error: string;
    detail?: string;
}

// Validation functions
export const validateNonogramName = (name: string): { valid: boolean; message?: string } => {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: "Name cannot be empty" };
    }
    
    if (name.length > 20) {
        return { valid: false, message: "Name cannot exceed 20 characters" };
    }
    
    // Only allow alphanumeric characters and basic punctuation
    const validNameRegex = /^[a-zA-Z0-9\s\-_\.!?]+$/;
    if (!validNameRegex.test(name)) {
        return { valid: false, message: "Name contains invalid characters" };
    }
    
    return { valid: true };
};

/**
 * Get a list of all available nonogram names
 */
export async function getNonogramList(): Promise<string[]> {
    try {
        logger.debug('Fetching nonogram list');
        const response = await fetch(`${API_BASE_URL}/nonograms/list`);
        
        if (!response.ok) {
            const errorData: ErrorResponse = await response.json();
            throw new Error(errorData.error || 'Failed to fetch nonogram list');
        }
        
        // Extract data and handle different response formats safely
        const data = await response.json();
        
        // Handle different response formats:
        // 1. Object with names property (expected format)
        // 2. Direct array (backward compatibility)
        if (data && typeof data === 'object') {
            if (Array.isArray(data.names)) {
                // Expected format: { names: string[] }
                return data.names;
            } else if (Array.isArray(data)) {
                // Direct array format
                return data;
            }
        }
        
        // Fallback to empty array for any other format
        logger.warn('Unexpected response format from getNonogramList:', data);
        return [];
    } catch (error) {
        logger.error('Error fetching nonogram list:', error);
        throw error;
    }
}

/**
 * Get a specific nonogram by name
 */
export async function getNonogramByName(name: string): Promise<Nonogram> {
    try {
        logger.debug(`Fetching nonogram: ${name}`);
        const response = await fetch(`${API_BASE_URL}/nonograms/${encodeURIComponent(name)}`);
        
        if (!response.ok) {
            const errorData: ErrorResponse = await response.json();
            throw new Error(errorData.error || `Failed to fetch nonogram: ${name}`);
        }
        
        return await response.json();
    } catch (error) {
        logger.error(`Error fetching nonogram "${name}":`, error);
        throw error;
    }
}

/**
 * Search for nonograms by clue
 */
export async function searchNonogramsByClue(clue: string): Promise<string[]> {
    try {
        logger.debug(`Searching nonograms with clue: ${clue}`);
        const response = await fetch(`${API_BASE_URL}/nonograms/search?clue=${encodeURIComponent(clue)}`);
        
        if (!response.ok) {
            const errorData: ErrorResponse = await response.json();
            throw new Error(errorData.error || 'Search failed');
        }
        
        // Extract data and handle different response formats safely
        const data = await response.json();
        
        // Handle different response formats:
        // 1. Direct array (current format)
        // 2. Object with matches property (possible future format)
        if (data && typeof data === 'object') {
            if (Array.isArray(data)) {
                // Direct array format
                return data;
            } else if (Array.isArray(data.matches)) {
                // Object with matches property
                return data.matches;
            }
        }
        
        // Fallback to empty array for any other format
        logger.warn('Unexpected response format from searchNonogramsByClue:', data);
        return [];
    } catch (error) {
        logger.error('Error searching nonograms:', error);
        throw error;
    }
}

/**
 * Create a new nonogram
 */
export async function createNonogram(nonogram: Omit<Nonogram, 'descriptors'>): Promise<Nonogram> {
    // Since this is a demo, we'll just calculate descriptors locally
    const descriptors = {
        rows: calculateRowDescriptors(nonogram.board),
        columns: calculateColumnDescriptors(nonogram.board)
    };
    
    // Return with descriptors
    return {
        ...nonogram,
        descriptors
    };
}

// Save a nonogram to the backend
export async function saveNonogram(nonogram: Omit<Nonogram, 'descriptors'>): Promise<Nonogram> {
    // Validate nonogram name
    const nameValidation = validateNonogramName(nonogram.name);
    if (!nameValidation.valid) {
        throw new Error(nameValidation.message);
    }
    
    try {
        logger.debug(`Saving nonogram: ${nonogram.name}`);
        
        const response = await fetch(`${API_BASE_URL}/nonograms/${encodeURIComponent(nonogram.name)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nonogram)
        });
        
        if (!response.ok) {
            const errorData: ErrorResponse = await response.json();
            throw new Error(errorData.error || 'Failed to save nonogram');
        }
        
        return await response.json();
    } catch (error) {
        logger.error(`Error saving nonogram "${nonogram.name}":`, error);
        throw error;
    }
}

// Helper function to calculate row descriptors
function calculateRowDescriptors(board: boolean[][]): number[][] {
    return board.map(row => {
        const descriptors = [];
        let count = 0;
        
        for (const cell of row) {
            if (cell) {
                count++;
            } else if (count > 0) {
                descriptors.push(count);
                count = 0;
            }
        }
        
        // Add the last group if it exists
        if (count > 0) {
            descriptors.push(count);
        }
        
        // If the row is all empty, add a 0
        if (descriptors.length === 0) {
            descriptors.push(0);
        }
        
        return descriptors;
    });
}

// Helper function to calculate column descriptors
function calculateColumnDescriptors(board: boolean[][]): number[][] {
    if (board.length === 0) return [];
    
    const columns: number[][] = Array(board[0].length).fill(0).map(() => []);
    
    for (let c = 0; c < board[0].length; c++) {
        let count = 0;
        
        for (let r = 0; r < board.length; r++) {
            if (board[r][c]) {
                count++;
            } else if (count > 0) {
                columns[c].push(count);
                count = 0;
            }
        }
        
        // Add the last group if it exists
        if (count > 0) {
            columns[c].push(count);
        }
        
        // If the column is all empty, add a 0
        if (columns[c].length === 0) {
            columns[c].push(0);
        }
    }
    
    return columns;
} 