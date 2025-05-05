// Define base URL for API calls
const API_BASE_URL = 'http://localhost:8000/api';

// Define interfaces to match backend types
export interface Nonogram {
    name: string;
    board: boolean[][];
    descriptors: {
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

/**
 * Get a list of all available nonogram names
 */
export async function getNonogramList(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/nonograms/list`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data: NonogramList = await response.json();
        return data.names;
    } catch (error) {
        console.error('Error fetching nonogram list:', error);
        throw error;
    }
}

/**
 * Get a specific nonogram by name
 */
export async function getNonogramByName(name: string): Promise<Nonogram> {
    try {
        console.log(`[DEBUG] Fetching nonogram by name: ${name}`);
        const response = await fetch(`${API_BASE_URL}/nonograms/${encodeURIComponent(name)}`);
        
        if (!response.ok) {
            const errorMessage = `API error: ${response.status} ${response.statusText}`;
            console.error(`[DEBUG] ${errorMessage}`);
            throw new Error(errorMessage);
        }
        
        const data: Nonogram = await response.json();
        console.log(`[DEBUG] Received nonogram data:`, {
            name: data.name,
            boardDimensions: data.board ? `${data.board.length}x${data.board[0]?.length}` : 'undefined',
            descriptorsPresent: !!data.descriptors,
            rowClues: data.descriptors?.rows?.length,
            colClues: data.descriptors?.columns?.length,
            boardSample: data.board?.[0]?.slice(0, 3)
        });
        
        // Validate that the received data has the expected structure
        if (!data.board || !Array.isArray(data.board) || data.board.length === 0) {
            console.error(`[DEBUG] Invalid board data received:`, data.board);
            throw new Error('Invalid board data received from API');
        }
        
        return data;
    } catch (error) {
        console.error(`[DEBUG] Error fetching nonogram '${name}':`, error);
        throw error;
    }
}

/**
 * Search for nonograms by clue
 */
export async function searchNonogramsByClue(clue: string): Promise<string[]> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/nonograms/search?clue=${encodeURIComponent(clue)}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data: NonogramSearchResult = await response.json();
        return data.matches;
    } catch (error) {
        console.error(`Error searching nonograms with clue '${clue}':`, error);
        throw error;
    }
}

/**
 * Create a new nonogram
 */
export async function createNonogram(nonogram: Omit<Nonogram, 'descriptors'>): Promise<Nonogram> {
    try {
        const response = await fetch(`${API_BASE_URL}/nonograms/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nonogram),
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data: Nonogram = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating nonogram:', error);
        throw error;
    }
} 