from typing import List, Optional
from pydantic import BaseModel, Field


class Nonogram(BaseModel):
    """
    Pydantic model for a Nonogram puzzle.
    """
    name: str = Field(..., description="The name of the nonogram puzzle")
    board: List[List[bool]] = Field(..., description="2D array of booleans representing the puzzle solution")
    descriptors: dict = Field(..., description="Dictionary containing row and column clues")

    @property
    def rows(self) -> int:
        """Number of rows in the puzzle"""
        return len(self.board)
    
    @property
    def columns(self) -> int:
        """Number of columns in the puzzle"""
        return len(self.board[0]) if self.rows > 0 else 0


class NonogramList(BaseModel):
    """
    Pydantic model for returning a list of nonogram names.
    """
    names: List[str] = Field(..., description="List of nonogram puzzle names")


class NonogramSearchResult(BaseModel):
    """
    Pydantic model for returning search results.
    """
    matches: List[str] = Field(..., description="List of nonogram names matching the search criteria")


class NonogramCreate(BaseModel):
    """
    Pydantic model for creating a new nonogram.
    """
    name: str = Field(..., description="The name of the nonogram puzzle")
    board: List[List[bool]] = Field(..., description="2D array of booleans representing the puzzle solution")
    # Descriptors will be calculated automatically 