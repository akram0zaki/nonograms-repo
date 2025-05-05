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