# Changelog

All notable changes to the Nonogram SPA Editor project will be documented in this file.

## [Unreleased]

### Fixed
- Fixed API endpoint issues in the frontend client (now using `/api/nonograms/list` instead of `/api/nonograms`)
- Enhanced API client to handle different response formats for better robustness:
  - Support for both `{ names: [...] }` and direct array responses
  - Support for both `{ matches: [...] }` and direct array search responses
- Added proxy configuration in `vite.config.js` to forward API requests from frontend to backend server
- Fixed API base URL handling to properly construct endpoints
- Updated unit tests to match the new API client implementation

### Added
- Added comprehensive unit tests for API client
- Added tests for proxy configuration to prevent regression
- Added tests for environment configuration
- Added response format handling tests to ensure client robustness

### Changed
- Improved error handling in API client
- Updated NonogramSelector to handle the new API response format
- Enhanced test coverage for all API client methods

## [1.1.0] - 2025-05-05

### Added
- Dark/light theme toggle
  - Added theme store with localStorage persistence
  - Added ThemeToggle component with sun/moon icons
  - Added CSS variables for theme-based styling
  - Applied theme styling to all application components

- Enhanced grid interactions
  - Implemented click and drag to set multiple cells
  - Added consistent painting behavior based on initial cell state
  - Improved drag detection and handling

- Accessibility improvements
  - Added proper ARIA roles to interactive elements
  - Added ARIA labels and descriptions for better screen reader support
  - Added structural roles (grid, row, cell) to nonogram grid
  - Added `aria-pressed` states to toggleable cells
  - Added `aria-selected` states to selectable items

- Keyboard navigation
  - Added arrow key navigation across grid cells
  - Added Enter/Space key support for cell toggling
  - Added Shift+Enter support for marking cells in play mode
  - Improved focus management and indicators

- Semantic HTML
  - Replaced div elements with appropriate semantic elements
  - Used button elements for interactive cells
  - Added proper form elements with labels

- Comprehensive unit tests
  - Added tests for theme store functionality
  - Added tests for grid component and interactions
  - Added tests for keyboard navigation
  - Added tests for ARIA attributes and accessibility features

### Changed
- Improved cell rendering with better visual feedback
- Enhanced mode toggle buttons with better styling
- Updated NonogramClues component styling
- Improved status bar messages
- Enhanced visual feedback for interaction states

### Fixed
- Grid display positioning issues
- Empty grid on puzzle load
- Theme toggle not affecting puzzle load/search section
- Inconsistent styling across components
- Improved focus visibility in both light and dark themes
- Fixed keyboard navigation from cell to cell

## [1.0.0] - 2025-05-015

### Added
- Initial release of Nonogram SPA Editor
- Basic nonogram viewing, playing, editing, and creation
- Puzzle loading and selection
- Clue search functionality
- Mode switching (View/Play/Edit/Create)
- Status messages and notifications

## [0.1.0] - 2023-05-01

### Added
- Initial release of the Nonogram SPA Editor
- Basic puzzle creation functionality
- Puzzle loading and saving
- Theme toggle for light/dark mode 