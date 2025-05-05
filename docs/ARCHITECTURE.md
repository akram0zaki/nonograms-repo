# Nonogram Editor Architecture

This document outlines the architecture and design patterns used in the Nonogram Editor application.

## Application Overview

The Nonogram Editor is a web-based Single-Page Application (SPA) for creating, editing, and playing nonogram puzzles. It consists of:

1. A FastAPI backend that provides data and search functionality
2. A SvelteKit frontend that handles the user interface and puzzle interaction

## System Architecture

### High-Level Architecture

```
┌────────────────────┐    HTTP    ┌────────────────────┐
│                    │◄─Requests─►│                    │
│  SvelteKit Frontend│            │   FastAPI Backend  │
│                    │            │                    │
└────────────────────┘            └────────────────────┘
         │                                 │
         │                                 │
         ▼                                 ▼
┌────────────────────┐            ┌────────────────────┐
│                    │            │                    │
│  Browser (Client)  │            │   JSON Data Store  │
│                    │            │                    │
└────────────────────┘            └────────────────────┘
```

### Frontend Architecture

The frontend follows a component-based architecture with central state management:

```
┌─────────────────────────────────────────────────────┐
│                   Main Application                   │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Nonogram    │  │ Nonogram    │  │ Status Bar  │  │
│  │ Selector    │  │ Display     │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │               Central State                  │    │
│  │  (Svelte Stores for Nonogram Data & Mode)    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │              API Client Layer                │    │
│  │     (Communication with Backend API)         │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Backend Architecture

The backend follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                  API Endpoints Layer                 │
│                                                     │
│   ┌────────────────┐  ┌───────────────────────┐     │
│   │ List Endpoint  │  │  Search & Get Endpoints│     │
│   └────────────────┘  └───────────────────────┘     │
└───────────────────────────┬─────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────┐
│                 Data Access Layer                    │
│                                                     │
│   ┌────────────────┐  ┌───────────────────────┐     │
│   │ Data Manager   │  │   Descriptor Calculator│     │
│   └────────────────┘  └───────────────────────┘     │
└───────────────────────────┬─────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────┐
│                  Data Store Layer                    │
│                                                     │
│               ┌────────────────────┐                │
│               │  JSON Data File    │                │
│               └────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

## Design Patterns

### Frontend Patterns

1. **Observer Pattern**: Svelte stores implement this pattern for reactive state management.
2. **Component Pattern**: UI is broken down into reusable, self-contained components.
3. **Pub/Sub Pattern**: Components communicate via events.
4. **Factory Pattern**: Functions that create or initialize specific types of data structures.

### Backend Patterns

1. **Repository Pattern**: The NonogramDataManager acts as a repository for nonogram data.
2. **Service Layer**: API endpoints function as a service layer over the data manager.
3. **DTO Pattern**: Pydantic models serve as Data Transfer Objects for validating and transferring data.
4. **Singleton Pattern**: The data manager is implemented as a singleton.

## Data Flow

### Loading a Nonogram

1. User selects a nonogram from the dropdown and clicks "Load"
2. Frontend dispatches a request to the API endpoint `/api/nonograms/{name}`
3. Backend retrieves the nonogram data from the JSON store
4. Backend returns the nonogram data to the frontend
5. Frontend updates the store with the nonogram data
6. UI components react to the store changes and update accordingly

### Playing a Nonogram

1. User interacts with the grid cells (click/right-click)
2. Grid component dispatches events to the parent component
3. Parent component updates the play state in the store
4. Grid cell appearance changes based on the updated state
5. Validation logic checks if the puzzle is solved
6. If solved, success message is displayed

### Creating/Editing a Nonogram

1. User draws on the grid by toggling cells
2. Grid component dispatches events to the parent component
3. Parent component updates the editor state in the store
4. Descriptor calculation is triggered on every cell toggle
5. Updated clues are displayed automatically
6. When "Process" is clicked, data is sent to the backend for validation
7. Backend calculates descriptors and returns the complete nonogram

## State Management

The application uses Svelte stores for state management:

1. **currentNonogram**: The currently loaded nonogram data
2. **appMode**: The current application mode (view, play, edit, create)
3. **editorBoardState**: The state of the grid in edit/create mode
4. **playBoardState**: The user's progress in play mode
5. **isDirty**: Flag indicating if there are unsaved changes
6. **statusMessage**: Message to display in the status bar

## Security Considerations

1. Input validation using Pydantic models on the backend
2. No user authentication in this version (stateless)
3. CORS configured to allow only specific origins in production

## Extensibility

The architecture is designed to be extensible:

1. Backend can be easily extended to support additional data sources (e.g., database)
2. Additional endpoints can be added for new functionality
3. Frontend components are modular and can be reused or extended
4. State management is centralized, making it easier to add new features

## Performance Considerations

1. Lightweight backend using FastAPI for high performance
2. Svelte for optimal frontend performance with minimal bundle size
3. In-memory caching of nonogram data on the backend
4. Responsive UI with optimized rendering

## Testing Strategy

1. **Backend**: Unit tests for data manager and descriptor calculator
2. **Frontend**: Component tests for UI components
3. **Integration**: API endpoint tests
4. **E2E**: Browser tests for the complete flow

## Architecture Overview

The Nonogram SPA Editor is built using a modern architecture with the following components:

### Frontend

The frontend is built with **SvelteKit**, a modern web framework for building web applications. The application is structured as follows:

- **Main App Layout**: The application layout defined in `routes/+layout.svelte` includes global styles and the theme mechanism.
- **Main App Page**: The primary application view is rendered in `routes/+page.svelte`.
- **Components**: Modular UI components in the `lib/components` directory.
- **Stores**: State management using Svelte stores in the `lib/stores` directory.
- **API Layer**: API communication layer in the `lib/api` directory.

### Frontend Components

The primary components of the application are:

1. **NonogramGrid**: Renders the nonogram grid for viewing, playing, editing, or creating. Features include:
   - Responsive grid rendering
   - Click and drag functionality for filling/marking multiple cells
   - Keyboard navigation and accessibility with ARIA attributes
   - Support for different modes (view, play, edit, create)

2. **NonogramClues**: Renders row and column clues for the nonogram.

3. **StatusBar**: Displays status messages and current nonogram information.

4. **NonogramSelector**: Allows users to select a nonogram from available puzzles.

5. **ThemeToggle**: Provides a toggle between light and dark theme modes.

### State Management

The application uses Svelte stores for state management:

1. **nonogramStore.ts**: Manages the core nonogram state including:
   - Current nonogram data
   - Application mode (view, play, edit, create)
   - Game state tracking
   - Grid manipulation functions

2. **themeStore.ts**: Manages the application theme:
   - Tracks light/dark theme preference
   - Persists theme selection in localStorage
   - Updates DOM with theme-specific classes

### Data Flow

1. **Loading Nonograms**: Nonograms are loaded from the backend API via the API client.
2. **State Manipulation**: User interactions update the appropriate store state.
3. **Rendering**: Components reactively update based on store changes.

### Styling

The application uses CSS with CSS variables for theming:

1. **Theme System**: Light and dark themes controlled by CSS variables
2. **Responsive Layout**: Adapts to different screen sizes
3. **Grid Styling**: Specialized styling for the nonogram grid

### Accessibility Features

The application implements several accessibility features:

1. **ARIA Attributes**: Proper ARIA roles and attributes throughout the application
2. **Keyboard Navigation**: Complete keyboard support for grid interaction
3. **Semantic HTML**: Using proper HTML semantics (buttons instead of divs)
4. **Focus Management**: Proper focus indicators and management
5. **Color Contrast**: Ensuring sufficient contrast in both light and dark themes

### Backend (Proposed)

The backend would be responsible for:

1. **Nonogram Storage**: Storing and retrieving nonogram puzzles
2. **User Authentication**: User management and authentication
3. **API Endpoints**: RESTful API for the frontend

## Key Design Patterns

The application employs several key design patterns:

1. **Component-Based Architecture**: UI elements are modularized as reusable components.
2. **Store Pattern**: Centralized state management with Svelte stores.
3. **Publisher/Subscriber Pattern**: Components subscribe to store changes.
4. **Factory Pattern**: Used in creating nonogram objects.
5. **Command Pattern**: Used for handling user actions and grid modifications.

## Future Extensibility

The architecture is designed for easy extensibility in several dimensions:

1. **New Features**: Additional features can be added by creating new components and stores.
2. **Backend Integration**: The API layer can be extended to communicate with a real backend.
3. **Mobile Support**: The responsive design allows for mobile adaptation.
4. **Offline Support**: Service workers could be added for offline capabilities 