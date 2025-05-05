import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getNonogramList, getNonogramByName, searchNonogramsByClue, saveNonogram } from '../client';

// Mock the fetch API
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getNonogramList', () => {
    it('should call the correct endpoint', async () => {
      // Setup mock response
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ names: ['puzzle1', 'puzzle2'] })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      await getNonogramList();

      // Verify the fetch call
      expect(global.fetch).toHaveBeenCalledWith('/api/nonograms/list');
    });

    it('should handle API response correctly and extract names property', async () => {
      // Setup mock response
      const mockNames = ['puzzle1', 'puzzle2', 'puzzle3'];
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ names: mockNames })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await getNonogramList();

      // Verify the result
      expect(result).toEqual(mockNames);
      expect(result).toHaveLength(3);
    });

    it('should handle empty response correctly', async () => {
      // Setup mock response with empty names array
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ names: [] })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await getNonogramList();

      // Verify the result is an empty array
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle missing names property gracefully', async () => {
      // Setup mock response with no names property
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({})
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await getNonogramList();

      // Verify default empty array is returned
      expect(result).toEqual([]);
    });

    it('should throw an error when the request fails', async () => {
      // Setup mock response
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Verify the function throws an error
      await expect(getNonogramList()).rejects.toThrow('Server error');
    });

    it('should handle network errors gracefully', async () => {
      // Setup mock response
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Verify the function throws an error
      await expect(getNonogramList()).rejects.toThrow('Network error');
    });
  });

  describe('getNonogramByName', () => {
    it('should call the correct endpoint with encoded name', async () => {
      // Setup mock response
      const mockNonogram = {
        name: 'Test Puzzle',
        board: [[true, false], [false, true]],
        descriptors: { rows: [[1], [1]], columns: [[1], [1]] }
      };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockNonogram)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function with a name that needs encoding
      await getNonogramByName('Test Puzzle');

      // Verify the fetch call with encoded name
      expect(global.fetch).toHaveBeenCalledWith('/api/nonograms/Test%20Puzzle');
    });

    it('should throw an error when the request fails', async () => {
      // Setup mock response
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Nonogram not found' })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Verify the function throws an error
      await expect(getNonogramByName('missing')).rejects.toThrow('Nonogram not found');
    });
  });

  describe('searchNonogramsByClue', () => {
    it('should call the correct endpoint with encoded clue', async () => {
      // Setup mock response
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(['puzzle1', 'puzzle2'])
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function with a clue that needs encoding
      await searchNonogramsByClue('1,2,3');

      // Verify the fetch call with encoded clue
      expect(global.fetch).toHaveBeenCalledWith('/api/nonograms/search?clue=1%2C2%2C3');
    });

    it('should return the search results correctly', async () => {
      // Setup mock response
      const mockMatches = ['puzzle1', 'puzzle2'];
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockMatches)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call the function
      const result = await searchNonogramsByClue('1,2,3');

      // Verify the result
      expect(result).toEqual(mockMatches);
    });

    it('should throw an error when the search fails', async () => {
      // Setup mock response
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Invalid clue format' })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Verify the function throws an error
      await expect(searchNonogramsByClue('invalid')).rejects.toThrow('Invalid clue format');
    });
  });

  describe('saveNonogram', () => {
    it('should validate nonogram name before making request', async () => {
      // Test with invalid name (too long)
      const invalidNonogram = {
        name: 'This name is way too long for the validation to pass properly',
        board: [[true, false], [false, true]]
      };

      // Verify validation fails and throws error before making fetch request
      await expect(saveNonogram(invalidNonogram)).rejects.toThrow('Name cannot exceed 20 characters');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should call the correct endpoint with proper request body', async () => {
      // Setup mock response
      const mockNonogram = {
        name: 'Valid Name',
        board: [[true, false], [false, true]],
        descriptors: { rows: [[1], [1]], columns: [[1], [1]] }
      };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockNonogram)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Prepare input nonogram (without descriptors)
      const inputNonogram = {
        name: 'Valid Name',
        board: [[true, false], [false, true]]
      };

      // Call the function
      await saveNonogram(inputNonogram);

      // Verify the fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/nonograms/Valid%20Name',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputNonogram)
        }
      );
    });

    it('should throw an error when the save fails', async () => {
      // Setup mock response
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Failed to save nonogram' })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Prepare valid input nonogram
      const inputNonogram = {
        name: 'Valid Name',
        board: [[true, false], [false, true]]
      };

      // Verify the function throws an error
      await expect(saveNonogram(inputNonogram)).rejects.toThrow('Failed to save nonogram');
    });
  });
}); 