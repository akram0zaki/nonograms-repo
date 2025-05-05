# Nonogram Editor

A web-based, single-page application (SPA) for creating, editing, and playing Nonogram (Picross/Griddlers) puzzles.

## Features

- View existing nonograms from a predefined collection
- Search nonograms by row/column clues
- Play nonograms with validation and completion detection
- Create new nonograms with custom dimensions
- Edit existing nonograms
- Automatic calculation of row and column clues

## Documentation

For detailed information about the application, please refer to the following documentation:

- [User Guide](docs/USER_GUIDE.md) - How to use the application's features
- [Architecture](docs/ARCHITECTURE.md) - Overview of the application's design and architecture
- [Deployment Guide](docs/DEPLOYMENT.md) - Instructions for deploying the application

## Application Structure

This project is divided into two main parts:

1. **Backend API** (Python/FastAPI): Serves nonogram data and handles search queries
2. **Frontend SPA** (Svelte/SvelteKit): Provides the user interface for all nonogram operations

## Getting Started

### Prerequisites

- [Python](https://www.python.org/) 3.8 or higher
- [Node.js](https://nodejs.org/) 16 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source .venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

#### Start the Backend Server

1. From the backend directory with the virtual environment activated:
   ```
   uvicorn main:app --reload
   ```
   
   The API will be available at `http://localhost:8000`

#### Start the Frontend Development Server

1. From the frontend directory:
   ```
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## Usage Guide

### Viewing and Playing Nonograms

1. Use the dropdown menu to select a nonogram from the list.
2. Click "Load Selected" to load the nonogram.
3. The nonogram will load in "View" mode by default.
4. Click the "Play" button to enter Play mode.
5. Click or drag on grid cells to fill them. Right-click to mark cells with an X.
6. When you correctly complete the puzzle, a success message will appear.

### Searching for Nonograms

1. Enter a clue pattern in the search box (e.g., "3 4" or "1,1,1").
2. The application will search for nonograms with matching row or column clues.
3. Select a nonogram from the search results and click "Load Selected".

### Creating a New Nonogram

1. Click "New Puzzle".
2. Enter the desired dimensions for the grid (rows and columns).
3. Click "Create Grid".
4. Click/drag on cells to toggle them between filled and empty.
5. The clues will update automatically based on your grid.
6. Click "Process Nonogram" to finalize your creation.

### Editing an Existing Nonogram

1. Load a nonogram.
2. Switch to "Edit" mode using the mode selector.
3. Modify the grid by clicking on cells.
4. The clues will update automatically.
5. Click "Process Nonogram" to apply your changes.

## Project Structure

```
nonogram-editor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── nonograms.py      # API endpoints
│   │   ├── core/
│   │   │   ├── models.py         # Pydantic data models
│   │   │   └── crud.py           # Data operations
│   │   └── data/
│   │       └── nonogram-games.json  # Sample nonogram data
│   ├── main.py                   # FastAPI application
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/       # Svelte components
│   │   │   ├── stores/           # Svelte stores for state management
│   │   │   └── api/              # API client
│   │   └── routes/               # SvelteKit routes
│   ├── package.json              # Node.js dependencies
│   └── svelte.config.js          # Svelte configuration
├── docs/
│   ├── ARCHITECTURE.md           # Application architecture documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── USER_GUIDE.md             # User manual
└── README.md                     # This file
```

## Technical Details

### Backend

- **FastAPI**: High-performance web framework for building APIs
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for running FastAPI applications

### Frontend

- **SvelteKit**: Framework for building web applications
- **Svelte**: Component-based JavaScript framework
- **TypeScript**: Typed JavaScript for better developer experience

## Future Enhancements (Planned)

- User accounts for saving personal puzzles
- Persistent storage of created/edited nonograms
- Advanced editor tools (line drawing, fill tool)
- Puzzle difficulty indicators
- Mobile optimization
- Automated test suite

## Known Issues and Troubleshooting

### Frontend Dependency Issues

If you encounter npm dependency errors when installing the frontend packages, use the `--legacy-peer-deps` flag:

```
cd frontend
npm install --legacy-peer-deps
```

This is necessary due to some version conflicts between SvelteKit and its plugins. Using this flag allows npm to bypass the peer dependency check and install the packages anyway.

Alternatively, you can use the `-f` or `--force` flag, but this is less recommended:

```
cd frontend
npm install --force
```

### Test Suite Execution

Some unit tests may fail due to TypeScript configuration issues. We're working on resolving these issues in future updates. These failures don't affect the functionality of the application. 