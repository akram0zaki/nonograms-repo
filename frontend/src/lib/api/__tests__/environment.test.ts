import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { API_BASE_URL } from '../client';

// Mock Vite's environment import
vi.mock('$app/environment', () => ({
  browser: true,
  dev: true
}));

describe('API Environment Configuration', () => {
  // Store original environment
  const originalEnv = { ...import.meta.env };
  
  beforeEach(() => {
    // Reset import.meta.env for each test
    vi.stubGlobal('import.meta.env', { 
      VITE_API_URL: undefined,
      MODE: 'development',
      DEV: true,
      PROD: false
    });
  });
  
  afterEach(() => {
    // Restore original environment
    vi.stubGlobal('import.meta.env', originalEnv);
  });

  it('should use default API URL when environment variable is not set', () => {
    // Re-import to get fresh value based on current env
    const { API_BASE_URL } = require('../client');
    
    // Check that default value is used
    expect(API_BASE_URL).toBe('/api');
  });

  it('should use environment variable for API URL when provided', () => {
    // Set environment variable
    vi.stubGlobal('import.meta.env', { 
      ...import.meta.env,
      VITE_API_URL: 'http://localhost:8000/api' 
    });
    
    // Re-import to get fresh value based on current env
    const { API_BASE_URL } = require('../client');
    
    // Check that environment value is used
    expect(API_BASE_URL).toBe('http://localhost:8000/api');
  });
  
  describe('API Endpoint Construction', () => {
    it('should construct correct endpoints with default API URL', () => {
      // Make sure we're using the default API URL
      vi.stubGlobal('import.meta.env', { VITE_API_URL: undefined });
      
      // Re-import to get fresh module
      const { getNonogramList, getNonogramByName, searchNonogramsByClue } = require('../client');
      
      // Use a spy to track fetch calls
      global.fetch = vi.fn().mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ names: [] })
        })
      );
      
      // Call API functions
      getNonogramList();
      getNonogramByName('test');
      searchNonogramsByClue('1,2,3');
      
      // Check endpoints
      expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/nonograms/list');
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/nonograms/test');
      expect(global.fetch).toHaveBeenNthCalledWith(3, '/api/nonograms/search?clue=1%2C2%2C3');
    });
    
    it('should construct correct endpoints with custom API URL', () => {
      // Set custom API URL
      vi.stubGlobal('import.meta.env', { 
        VITE_API_URL: 'http://api.nonograms.com' 
      });
      
      // Re-import to get fresh module
      const { getNonogramList, getNonogramByName, searchNonogramsByClue } = require('../client');
      
      // Use a spy to track fetch calls
      global.fetch = vi.fn().mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ names: [] })
        })
      );
      
      // Call API functions
      getNonogramList();
      getNonogramByName('test');
      searchNonogramsByClue('1,2,3');
      
      // Check endpoints
      expect(global.fetch).toHaveBeenNthCalledWith(1, 'http://api.nonograms.com/nonograms/list');
      expect(global.fetch).toHaveBeenNthCalledWith(2, 'http://api.nonograms.com/nonograms/test');
      expect(global.fetch).toHaveBeenNthCalledWith(3, 'http://api.nonograms.com/nonograms/search?clue=1%2C2%2C3');
    });
  });
}); 