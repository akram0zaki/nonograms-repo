import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNonogramList, searchNonogramsByClue } from '../client';

// Mock fetch API
global.fetch = vi.fn();

describe('API Response Format Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getNonogramList', () => {
    it('should correctly extract names property from API response', async () => {
      // Mock successful API response with names property
      const mockNames = ['puzzle1', 'puzzle2', 'puzzle3'];
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ names: mockNames })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Call function
      const result = await getNonogramList();
      
      // Verify results are extracted from names property
      expect(result).toEqual(mockNames);
    });
    
    it('should handle direct array response format (backward compatibility)', async () => {
      // Mock successful API response returning array directly
      const mockNames = ['puzzle1', 'puzzle2', 'puzzle3'];
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockNames)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Call function and capture result directly
      const result = await getNonogramList();
      
      // We expect the function to return the array directly (now handled by client)
      expect(result).toEqual(mockNames);
    });
    
    it('should gracefully handle invalid response formats', async () => {
      // Mock responses with invalid formats
      const testCases = [
        { response: null, expected: [] },
        { response: undefined, expected: [] },
        { response: {}, expected: [] },
        { response: { wrongProperty: ['a', 'b'] }, expected: [] },
        { response: { names: null }, expected: [] },
        { response: { names: 'not-an-array' }, expected: [] }
      ];
      
      // Test each case
      for (const testCase of testCases) {
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(testCase.response)
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        
        // Call function
        const result = await getNonogramList();
        
        // Verify graceful handling with empty array
        expect(result).toEqual(testCase.expected);
        
        // Clear mock for next case
        vi.clearAllMocks();
      }
    });
  });
  
  describe('searchNonogramsByClue', () => {
    it('should handle direct array response format', async () => {
      // Mock successful API response
      const mockNames = ['puzzle1', 'puzzle2'];
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockNames)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Call function
      const result = await searchNonogramsByClue('1,2,3');
      
      // Verify results are returned directly
      expect(result).toEqual(mockNames);
    });
    
    it('should handle response with matches property', async () => {
      // Mock successful API response with matches property
      const mockNames = ['puzzle1', 'puzzle2'];
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ matches: mockNames })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Call function
      const result = await searchNonogramsByClue('1,2,3');
      
      // Our implementation should now extract the matches property
      expect(result).toEqual(mockNames);
    });
  });
  
  it('should be robust against response format changes', async () => {
    // Create a test helper function that validates API client behavior
    const testResponseFormat = async (response: any, expectedResult: any) => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(response)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Call function
      const result = await getNonogramList();
      
      // Verify results match expected format
      expect(result).toEqual(expectedResult);
      
      // Clear mock
      vi.clearAllMocks();
    };
    
    // Test various response formats
    await testResponseFormat({ names: ['a', 'b', 'c'] }, ['a', 'b', 'c']); // Correct format
    await testResponseFormat(['a', 'b', 'c'], ['a', 'b', 'c']); // Direct array (now handled by our implementation)
    await testResponseFormat({}, []); // Empty object
    await testResponseFormat({ invalidProp: ['a'] }, []); // Wrong property
    
    // This test suite will reveal that our implementation isn't robust against API response format changes
  });
}); 