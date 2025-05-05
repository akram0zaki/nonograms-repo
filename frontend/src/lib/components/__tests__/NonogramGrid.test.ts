/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import NonogramGrid from '../NonogramGrid.svelte';
import type { AppMode, CellState } from '../../stores/nonogramStore';

describe('NonogramGrid Component', () => {
  // Test rendering in view mode
  test('renders a grid in view mode', () => {
    const board = [
      [true, false],
      [false, true]
    ];
    
    const { container } = render(NonogramGrid, { 
      props: { 
        board, 
        mode: 'view' as AppMode
      } 
    });
    
    // Check that the grid container is rendered
    const gridContainer = container.querySelector('.grid-container');
    expect(gridContainer).toBeTruthy();
    
    // Check that cells are rendered
    const cells = container.querySelectorAll('button.cell');
    expect(cells.length).toBe(4);
    
    // Check that filled cells have the appropriate class
    const filledCells = container.querySelectorAll('.filled');
    expect(filledCells.length).toBe(2);
  });
  
  // Test rendering in play mode
  test('renders a grid in play mode', () => {
    const board = [
      ['empty', 'filled'] as CellState[],
      ['marked', 'empty'] as CellState[]
    ];
    
    const { container } = render(NonogramGrid, { 
      props: { 
        board, 
        mode: 'play' as AppMode
      } 
    });
    
    // Check that the appropriate cells are filled or marked
    const filledCells = container.querySelectorAll('button[data-cell-value="filled"]');
    expect(filledCells.length).toBe(1);
    
    const markedCells = container.querySelectorAll('button[data-cell-value="marked"]');
    expect(markedCells.length).toBe(1);
  });
  
  // Test cell toggling via mousedown event
  test('dispatches cellToggle event on mousedown', () => {
    const board = [
      [false, false],
      [false, false]
    ];
    
    const { component, container } = render(NonogramGrid, { 
      props: { 
        board, 
        mode: 'edit' as AppMode
      } 
    });
    
    // Set up a spy for the cellToggle event
    const mockDispatch = jest.fn();
    component.$on('cellToggle', mockDispatch);
    
    // Get the first cell and click it
    const firstCell = container.querySelector('button');
    fireEvent.mouseDown(firstCell as Element, { button: 0 }); // Left click
    
    // Check that the event was dispatched with the correct parameters
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch.mock.calls[0][0].detail).toEqual(
      expect.objectContaining({
        row: 0,
        col: 0,
        isRightClick: false
      })
    );
  });
  
  // Test cell toggling via right-click
  test('dispatches cellToggle with isRightClick=true on right mousedown', () => {
    const board = [
      [false, false],
      [false, false]
    ];
    
    const { component, container } = render(NonogramGrid, { 
      props: { 
        board, 
        mode: 'play' as AppMode
      } 
    });
    
    // Set up a spy for the cellToggle event
    const mockDispatch = jest.fn();
    component.$on('cellToggle', mockDispatch);
    
    // Get the first cell and right-click it
    const firstCell = container.querySelector('button');
    fireEvent.mouseDown(firstCell as Element, { button: 2 }); // Right click
    
    // Check that the event was dispatched with the correct parameters
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch.mock.calls[0][0].detail).toEqual(
      expect.objectContaining({
        row: 0,
        col: 0,
        isRightClick: true
      })
    );
  });
  
  // Test keyboard navigation and cell toggling
  test('allows toggling cells with keyboard', () => {
    const board = [
      [false, false],
      [false, false]
    ];
    
    const { component, container } = render(NonogramGrid, { 
      props: { 
        board, 
        mode: 'edit' as AppMode
      } 
    });
    
    // Set up a spy for the cellToggle event
    const mockDispatch = jest.fn();
    component.$on('cellToggle', mockDispatch);
    
    // Get the first cell and press Enter
    const firstCell = container.querySelector('button');
    fireEvent.keyDown(firstCell as Element, { key: 'Enter' });
    
    // Check that the event was dispatched
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch.mock.calls[0][0].detail).toEqual(
      expect.objectContaining({
        row: 0,
        col: 0,
        isRightClick: false
      })
    );
  });
  
  // Test ARIA attributes
  test('sets correct ARIA attributes', () => {
    const board = [
      [true, false],
      [false, false]
    ] as boolean[][];
    
    const { container } = render(NonogramGrid, { 
      props: { 
        board, 
        mode: 'view' as AppMode
      } 
    });
    
    // Check that the grid has proper ARIA attributes
    const gridContainer = container.querySelector('.grid-container');
    expect(gridContainer).toHaveAttribute('role', 'region');
    expect(gridContainer).toHaveAttribute('aria-label', 'Nonogram puzzle grid');
    
    // Check that the grid has proper ARIA attributes
    const grid = container.querySelector('.grid');
    expect(grid).toHaveAttribute('role', 'grid');
    expect(grid).toHaveAttribute('aria-rowcount', '2');
    expect(grid).toHaveAttribute('aria-colcount', '2');
    
    // Check that the first cell has proper ARIA attributes
    const firstCell = container.querySelector('button');
    expect(firstCell).toHaveAttribute('aria-pressed', 'true');
    expect(firstCell).toHaveAttribute('aria-rowindex', '1');
    expect(firstCell).toHaveAttribute('aria-colindex', '1');
  });
}); 