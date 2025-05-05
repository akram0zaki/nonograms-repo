import json
import os
import time
from typing import List, Dict, Optional, Tuple, Any
from .models import Nonogram, NonogramCreate


class NonogramDataManager:
    """
    Class for managing nonogram data operations with caching.
    """
    def __init__(self, json_file_path: str, cache_ttl: int = 300):
        self.json_file_path = json_file_path
        self._data = {}
        self._last_load_time = 0
        self._cache_ttl = cache_ttl  # Cache time-to-live in seconds
        self._load_data()
    
    def _load_data(self) -> None:
        """Load nonogram data from the JSON file with cache validation"""
        current_time = time.time()
        
        # Check if file has been modified since last load
        file_modified = False
        if os.path.exists(self.json_file_path):
            file_mtime = os.path.getmtime(self.json_file_path)
            if file_mtime > self._last_load_time:
                file_modified = True
        
        # If cache is expired or file has been modified, reload data
        if (current_time - self._last_load_time > self._cache_ttl) or file_modified:
            if os.path.exists(self.json_file_path):
                try:
                    with open(self.json_file_path, 'r') as f:
                        self._data = json.load(f)
                    self._last_load_time = current_time
                except json.JSONDecodeError:
                    print(f"Error: Could not parse JSON from {self.json_file_path}")
                    # Keep the old data if JSON is invalid
                except Exception as e:
                    print(f"Error loading data: {str(e)}")
                    # Keep the old data if there's an error
            else:
                print(f"Warning: JSON file not found at {self.json_file_path}")
                self._data = {}
                self._last_load_time = current_time
    
    def get_all_names(self) -> List[str]:
        """Get a list of all nonogram names"""
        # Ensure data is fresh
        self._load_data()
        return list(self._data.keys())
    
    def get_by_name(self, name: str) -> Optional[Nonogram]:
        """Get a nonogram by name"""
        # Ensure data is fresh
        self._load_data()
        
        if name in self._data:
            try:
                return Nonogram(
                    name=name,
                    board=self._data[name].get("board", []),
                    descriptors=self._data[name].get("descriptors", {})
                )
            except Exception as e:
                print(f"Error creating Nonogram object for {name}: {str(e)}")
                return None
        return None
    
    def search_by_clue(self, clue_query: str) -> List[str]:
        """
        Search for nonograms with matching clues.
        The clue_query format should be numbers separated by spaces or commas.
        """
        # Ensure data is fresh
        self._load_data()
        
        matches = []
        # Parse the query into a list of integers
        try:
            # Handle both comma and space separated values
            clue = [int(x.strip()) for x in clue_query.replace(',', ' ').split() if x.strip()]
        except ValueError:
            # If the query can't be parsed, return empty list
            return []
        
        # Search through all nonograms
        for name, data in self._data.items():
            descriptors = data.get("descriptors", {})
            
            # Search in row descriptors
            row_descriptors = descriptors.get("rows", [])
            for row in row_descriptors:
                if row == clue:
                    matches.append(name)
                    break
            
            # If already matched, skip searching columns
            if name in matches:
                continue
            
            # Search in column descriptors
            col_descriptors = descriptors.get("columns", [])
            for col in col_descriptors:
                if col == clue:
                    matches.append(name)
                    break
        
        return matches
    
    @staticmethod
    def calculate_descriptors(board: List[List[bool]]) -> Dict[str, List[List[int]]]:
        """Calculate row and column descriptors from a board"""
        if not board or not board[0]:
            return {"rows": [], "columns": []}
        
        rows = len(board)
        cols = len(board[0])
        
        # Calculate row descriptors
        row_descriptors = []
        for r in range(rows):
            row_desc = []
            count = 0
            for c in range(cols):
                if board[r][c]:  # If cell is filled
                    count += 1
                elif count > 0:  # If we have a filled sequence that just ended
                    row_desc.append(count)
                    count = 0
            
            # Handle case where sequence continues to the end of the row
            if count > 0:
                row_desc.append(count)
            
            # If row is empty, add a 0
            if not row_desc:
                row_desc = [0]
                
            row_descriptors.append(row_desc)
        
        # Calculate column descriptors
        col_descriptors = []
        for c in range(cols):
            col_desc = []
            count = 0
            for r in range(rows):
                if board[r][c]:  # If cell is filled
                    count += 1
                elif count > 0:  # If we have a filled sequence that just ended
                    col_desc.append(count)
                    count = 0
            
            # Handle case where sequence continues to the end of the column
            if count > 0:
                col_desc.append(count)
            
            # If column is empty, add a 0
            if not col_desc:
                col_desc = [0]
                
            col_descriptors.append(col_desc)
        
        return {
            "rows": row_descriptors,
            "columns": col_descriptors
        }
    
    def create_nonogram(self, nonogram: NonogramCreate) -> Nonogram:
        """Create a new nonogram with calculated descriptors"""
        descriptors = self.calculate_descriptors(nonogram.board)
        
        # For now, just create the object without saving to the data store
        return Nonogram(
            name=nonogram.name,
            board=nonogram.board,
            descriptors=descriptors
        )

# Create a singleton instance with the correct path
data_manager = NonogramDataManager(os.path.join(os.path.dirname(__file__), "../data/nonogram-games.json")) 