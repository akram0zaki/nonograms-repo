# User Guide - Nonogram SPA Editor

## Introduction

Welcome to the Nonogram SPA Editor, a web-based application for creating, editing, and playing nonogram puzzles (also known as Picross or Griddlers). This guide will help you understand how to use all features of the application.

## Getting Started

### Accessing the Application

The Nonogram SPA Editor is a web application that runs in modern browsers. Simply navigate to the application URL in your web browser.

### Interface Overview

The application interface consists of the following main areas:

- **Header**: Shows the application name
- **Status Bar**: Displays the current nonogram name and status messages
- **Mode Toggles**: Buttons to switch between different application modes
- **Controls Bar**: Contains the nonogram selector and search functionality
- **Nonogram Area**: Displays the grid and clues for the current nonogram

## Main Features

### Loading Nonograms

1. Use the dropdown menu in the controls bar to select a nonogram
2. Click the "Load Selected" button to load the chosen nonogram
3. The nonogram will be displayed in the nonogram area

### Searching for Nonograms

1. Enter a clue pattern in the search input field (e.g., "3 4" or "1,1,1")
2. The application will search for nonograms with matching clues
3. Select from the matching results and click "Load Selected"

### Playing Nonograms

1. After loading a nonogram, click the "Play" mode button
2. The grid will be cleared, ready for you to solve the puzzle
3. Left-click on a cell to fill it (indicating it should be colored)
4. Right-click on a cell to mark it with an X (indicating it should remain empty)
5. When you correctly complete the puzzle, a success message will appear

### Viewing Nonograms

1. After loading a nonogram, click the "View" mode button
2. The grid will display the completed solution

### Creating New Nonograms

1. Click "New Puzzle" button in the controls bar
2. Enter the desired dimensions for the grid (rows and columns)
3. Click "Create Grid" to generate an empty grid
4. Click on cells to toggle them between filled and empty
5. The row and column clues will update automatically
6. Click "Process Nonogram" when finished

### Editing Existing Nonograms

1. Load an existing nonogram
2. Click the "Edit" mode button
3. Modify the grid by clicking on cells to toggle them
4. The clues will update automatically based on your changes
5. Click "Process Nonogram" to apply your changes

## Mode Details

### View Mode

- Displays the completed nonogram solution
- Cells are shown in their final state (filled or empty)
- No interaction with the grid is possible

### Play Mode

- Presents an empty grid for solving the puzzle
- Left-click fills a cell, right-click marks a cell with an X
- Click and drag to fill or mark multiple cells
- Successfully solving the puzzle triggers a congratulatory message

### Edit Mode

- Allows modifying an existing nonogram's solution
- Click to toggle cells between filled and empty
- Clues update automatically as you make changes

### Create Mode

- Similar to Edit mode, but starts with a blank grid
- Specify grid dimensions before creating
- Click to toggle cells between filled and empty
- Clues update automatically as you make changes

## Tips and Tricks

### Efficient Solving

- Start with rows and columns that have large numbers
- Look for overlaps between possible positions for filled cells
- Use X marks to track cells you're sure should be empty

### Creating Good Puzzles

- Start with a simple, recognizable shape
- Avoid having too many isolated cells
- Test your puzzle by trying to solve it yourself
- Keep the dimensions reasonable (5x5 to 15x15 is ideal for most puzzles)

### Keyboard Shortcuts

- In Play mode, press Space bar to fill a cell while focused
- Press Enter to fill a cell
- Shift+Enter to mark a cell with X

## Troubleshooting

### Grid Not Displaying

- Make sure you've loaded a nonogram successfully
- Check that you're in the correct mode (View/Play/Edit)
- Try reloading the application if problems persist

### Changes Not Saving

- Note that in version 1.0, nonograms are not saved permanently to the backend
- The "Process Nonogram" button only validates your changes

### Browser Compatibility

- The application works best in modern browsers (Chrome, Firefox, Edge, Safari)
- Enable JavaScript if it's disabled in your browser

## Accessibility Features

### Theme Toggle

The application supports both light and dark themes for better user experience and accessibility:

1. **Switching Themes**: Click the theme toggle button in the top-right corner of the screen to switch between light and dark themes.
   - Light theme is optimized for daytime usage and bright environments
   - Dark theme reduces eye strain in low-light conditions and conserves battery on OLED displays

2. **Theme Persistence**: Your theme preference is saved and will be remembered across browser sessions.

### Keyboard Navigation

The nonogram grid fully supports keyboard navigation for accessibility:

1. **Tab Navigation**: Use the Tab key to navigate between cells in the grid.
2. **Arrow Keys**: Once a cell is focused, use arrow keys to navigate to adjacent cells.
3. **Enter/Space**: Press Enter or Space to toggle the state of the focused cell.
4. **Shift+Enter/Space**: In play mode, press Shift+Enter or Shift+Space to mark a cell.

### Screen Reader Support

The application is designed to work well with screen readers:

1. **ARIA Attributes**: All interactive elements have proper ARIA attributes for better screen reader support.
2. **Descriptive Labels**: Cells have descriptive labels indicating their position and state.
3. **Structural Roles**: The grid uses appropriate ARIA roles to convey its structure and purpose.

## Mouse Interactions

### Click and Drag

The nonogram grid supports enhanced mouse interactions:

1. **Click and Drag**: Click on a cell and drag across multiple cells to fill or mark them all at once.
2. **Right-Click and Drag**: In play mode, right-click and drag to mark multiple cells as empty.
3. **Consistent Painting**: When dragging, all cells will be toggled to the opposite state of the first cell you clicked.

## Conclusion

The Nonogram SPA Editor provides a comprehensive set of tools for nonogram enthusiasts. Enjoy creating, editing, and playing nonogram puzzles with its intuitive interface and responsive design. 