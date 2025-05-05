import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.nonograms import router as nonograms_router

# Create the FastAPI app
app = FastAPI(
    title="Nonogram Editor API",
    description="API for managing nonogram puzzles for a web-based editor",
    version="1.0.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(nonograms_router, prefix="/api/nonograms", tags=["nonograms"])

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """
    Root endpoint, useful for checking if the API is running.
    """
    return {"message": "Welcome to the Nonogram Editor API"}

# Run the server if this file is executed directly
if __name__ == "__main__":
    import uvicorn
    
    # Determine the port to run on (default to 8000 if not specified)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the server
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 