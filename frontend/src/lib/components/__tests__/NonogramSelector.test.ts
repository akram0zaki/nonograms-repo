import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import NonogramSelector from '../NonogramSelector.svelte';
import * as apiClient from '../../api/client';
import { availableNonograms, searchResults, statusMessage } from '../../stores/nonogramStore';
import { get } from 'svelte/store';

// Mock the API client
vi.mock('../../api/client', () => ({
  getNonogramList: vi.fn(),
  searchNonogramsByClue: vi.fn()
}));

describe('NonogramSelector', () => {
  beforeEach(() => {
    // Reset stores to initial state
    availableNonograms.set([]);
    searchResults.set([]);
    statusMessage.set('');
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initial Load', () => {
    it('should fetch nonogram list on mount and update store', async () => {
      // Mock successful API response
      const mockNonograms = ['puzzle1', 'puzzle2'];
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(mockNonograms);
      
      // Render component
      render(NonogramSelector);
      
      // Wait for API call and store update
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
        expect(get(availableNonograms)).toEqual(mockNonograms);
      });
      
      // Verify loading message was shown and then cleared
      expect(get(statusMessage)).toBe('');
    });

    it('should handle API errors during initial load', async () => {
      // Mock API error
      vi.mocked(apiClient.getNonogramList).mockRejectedValue(new Error('API error'));
      
      // Render component
      render(NonogramSelector);
      
      // Wait for API call and error handling
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
        expect(get(statusMessage)).toBe('Error loading nonogram list. Please try again later.');
      });
    });

    it('should select first nonogram by default when list loads', async () => {
      // Mock successful API response
      const mockNonograms = ['puzzle1', 'puzzle2'];
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(mockNonograms);
      
      // Render component
      const { component } = render(NonogramSelector);
      
      // Wait for API call and store update
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Access component instance to check selected nonogram
      // @ts-ignore - accessing private property
      expect(component.selectedNonogram).toBe('puzzle1');
    });
  });

  describe('Nonogram Selection', () => {
    it('should dispatch select event with correct nonogram when Load button is clicked', async () => {
      // Mock successful API response
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2']);
      
      // Render component with mock event handler
      const { component } = render(NonogramSelector);
      const mockDispatch = vi.fn();
      // @ts-ignore - replacing private method
      component.dispatch = mockDispatch;
      
      // Wait for API call
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Find and click the Load button
      const loadButton = screen.getByText('Load Selected');
      await fireEvent.click(loadButton);
      
      // Verify the event was dispatched with the correct nonogram
      expect(mockDispatch).toHaveBeenCalledWith('select', 'puzzle1');
    });
  });

  describe('Search Functionality', () => {
    it('should call searchNonogramsByClue with correct parameters', async () => {
      // Mock successful API responses
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2']);
      vi.mocked(apiClient.searchNonogramsByClue).mockResolvedValue(['puzzle1']);
      
      // Render component
      render(NonogramSelector);
      
      // Wait for initial load
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Enter search query and trigger input event
      const searchInput = screen.getByPlaceholderText(/Enter clue/);
      await fireEvent.input(searchInput, { target: { value: '1,2,3' } });
      
      // Force the debounce to complete immediately
      vi.runAllTimers();
      
      // Verify search was called with correct parameters
      await waitFor(() => {
        expect(apiClient.searchNonogramsByClue).toHaveBeenCalledWith('1,2,3');
      });
    });

    it('should update search results in store when search completes', async () => {
      // Mock successful API responses
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2', 'puzzle3']);
      const mockSearchResults = ['puzzle2'];
      vi.mocked(apiClient.searchNonogramsByClue).mockResolvedValue(mockSearchResults);
      
      // Render component
      render(NonogramSelector);
      
      // Wait for initial load
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Enter search query and trigger input event
      const searchInput = screen.getByPlaceholderText(/Enter clue/);
      await fireEvent.input(searchInput, { target: { value: '1,2,3' } });
      
      // Force the debounce to complete immediately
      vi.runAllTimers();
      
      // Verify search results are updated in store
      await waitFor(() => {
        expect(get(searchResults)).toEqual(mockSearchResults);
      });
      
      // Verify status message indicates matches found
      expect(get(statusMessage)).toBe('Found 1 matching nonogram(s)');
    });

    it('should handle empty search results', async () => {
      // Mock successful API responses
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2']);
      vi.mocked(apiClient.searchNonogramsByClue).mockResolvedValue([]);
      
      // Render component
      render(NonogramSelector);
      
      // Wait for initial load
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Enter search query and trigger input event
      const searchInput = screen.getByPlaceholderText(/Enter clue/);
      await fireEvent.input(searchInput, { target: { value: '999' } });
      
      // Force the debounce to complete immediately
      vi.runAllTimers();
      
      // Verify appropriate status message for no matches
      await waitFor(() => {
        expect(get(statusMessage)).toBe('No matches found');
      });
    });

    it('should handle API errors during search', async () => {
      // Mock successful initial load but failed search
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2']);
      vi.mocked(apiClient.searchNonogramsByClue).mockRejectedValue(new Error('Search failed'));
      
      // Render component
      render(NonogramSelector);
      
      // Wait for initial load
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Enter search query and trigger input event
      const searchInput = screen.getByPlaceholderText(/Enter clue/);
      await fireEvent.input(searchInput, { target: { value: '1,2,3' } });
      
      // Force the debounce to complete immediately
      vi.runAllTimers();
      
      // Verify error message is displayed
      await waitFor(() => {
        expect(get(statusMessage)).toBe('Error during search. Please try again.');
      });
    });

    it('should clear search results when search query is emptied', async () => {
      // Mock successful API responses
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2']);
      vi.mocked(apiClient.searchNonogramsByClue).mockResolvedValue(['puzzle1']);
      
      // Render component
      render(NonogramSelector);
      
      // Wait for initial load
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Set initial search results
      searchResults.set(['puzzle1']);
      
      // Enter search query and then clear it
      const searchInput = screen.getByPlaceholderText(/Enter clue/);
      await fireEvent.input(searchInput, { target: { value: '' } });
      
      // Force the debounce to complete immediately
      vi.runAllTimers();
      
      // Verify search results are cleared
      await waitFor(() => {
        expect(get(searchResults)).toEqual([]);
        expect(get(statusMessage)).toBe('');
      });
    });
  });

  describe('New Puzzle Button', () => {
    it('should dispatch new event when New Puzzle button is clicked', async () => {
      // Mock successful API response
      vi.mocked(apiClient.getNonogramList).mockResolvedValue(['puzzle1', 'puzzle2']);
      
      // Render component with mock event handler
      const { component } = render(NonogramSelector);
      const mockDispatch = vi.fn();
      // @ts-ignore - replacing private method
      component.dispatch = mockDispatch;
      
      // Wait for API call
      await waitFor(() => {
        expect(apiClient.getNonogramList).toHaveBeenCalledTimes(1);
      });
      
      // Find and click the New Puzzle button
      const newButton = screen.getByText('New Puzzle');
      await fireEvent.click(newButton);
      
      // Verify the event was dispatched
      expect(mockDispatch).toHaveBeenCalledWith('new');
    });
  });
}); 