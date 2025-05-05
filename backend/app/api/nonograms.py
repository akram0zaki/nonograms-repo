from fastapi import APIRouter, HTTPException, Query
from typing import List

from ..core.models import Nonogram, NonogramList, NonogramSearchResult, NonogramCreate
from ..core.crud import data_manager

router = APIRouter()


@router.get("/list", response_model=NonogramList)
async def get_nonogram_list():
    """
    Get a list of all available nonogram names.
    """
    names = data_manager.get_all_names()
    return NonogramList(names=names)


@router.get("/search", response_model=NonogramSearchResult)
async def search_nonograms(clue: str = Query(..., description="Clue string to search for, e.g. '1,2,3' or '1 2 3'")):
    """
    Search for nonograms that have the specified clue in their row or column descriptors.
    """
    matches = data_manager.search_by_clue(clue)
    return NonogramSearchResult(matches=matches)


@router.get("/{name}", response_model=Nonogram)
async def get_nonogram(name: str):
    """
    Get the full data for a specific nonogram by name.
    """
    nonogram = data_manager.get_by_name(name)
    if nonogram is None:
        raise HTTPException(
            status_code=404, 
            detail=f"Nonogram with name '{name}' not found"
        )
    return nonogram


@router.post("/", response_model=Nonogram)
async def create_nonogram(nonogram: NonogramCreate):
    """
    Create a new nonogram (descriptors will be calculated automatically).
    This is currently a stateless operation - the nonogram is not saved to the data store.
    """
    # In a future version, this would save to persistent storage
    return data_manager.create_nonogram(nonogram) 