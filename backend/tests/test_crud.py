import unittest
import json
import os
import tempfile
from typing import Dict, Any

from app.core.crud import NonogramDataManager
from app.core.models import NonogramCreate

class TestNonogramDataManager(unittest.TestCase):
    """Test cases for NonogramDataManager."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a temporary JSON file with test data
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
        self.temp_file.close()
        
        # Define test data
        self.test_data = {
            "test_nonogram": {
                "board": [
                    [False, True, False],
                    [True, True, True],
                    [False, True, False]
                ],
                "descriptors": {
                    "rows": [[1], [3], [1]],
                    "columns": [[1], [3], [1]]
                }
            },
            "another_test": {
                "board": [
                    [True, True],
                    [True, True]
                ],
                "descriptors": {
                    "rows": [[2], [2]],
                    "columns": [[2], [2]]
                }
            }
        }
        
        # Write test data to the temporary file
        with open(self.temp_file.name, 'w') as f:
            json.dump(self.test_data, f)
        
        # Create a NonogramDataManager instance with the temp file
        self.data_manager = NonogramDataManager(self.temp_file.name)
    
    def tearDown(self):
        """Tear down test fixtures."""
        # Remove the temporary file
        os.unlink(self.temp_file.name)
    
    def test_get_all_names(self):
        """Test getting all nonogram names."""
        names = self.data_manager.get_all_names()
        self.assertEqual(set(names), {"test_nonogram", "another_test"})
    
    def test_get_by_name(self):
        """Test getting a nonogram by name."""
        nonogram = self.data_manager.get_by_name("test_nonogram")
        self.assertIsNotNone(nonogram)
        self.assertEqual(nonogram.name, "test_nonogram")
        self.assertEqual(nonogram.board, self.test_data["test_nonogram"]["board"])
        self.assertEqual(nonogram.descriptors, self.test_data["test_nonogram"]["descriptors"])
    
    def test_get_by_invalid_name(self):
        """Test getting a nonogram with an invalid name."""
        nonogram = self.data_manager.get_by_name("nonexistent")
        self.assertIsNone(nonogram)
    
    def test_search_by_clue(self):
        """Test searching nonograms by clue."""
        # Search for clue [3] which exists in test_nonogram
        matches = self.data_manager.search_by_clue("3")
        self.assertEqual(matches, ["test_nonogram"])
        
        # Search for clue [2] which exists in another_test
        matches = self.data_manager.search_by_clue("2")
        self.assertEqual(matches, ["another_test"])
        
        # Search for nonexistent clue
        matches = self.data_manager.search_by_clue("4")
        self.assertEqual(matches, [])
    
    def test_calculate_descriptors(self):
        """Test calculation of descriptors from a board."""
        # Test with cross pattern
        board = [
            [False, True, False],
            [True, True, True],
            [False, True, False]
        ]
        
        descriptors = NonogramDataManager.calculate_descriptors(board)
        expected = {
            "rows": [[1], [3], [1]],
            "columns": [[1], [3], [1]]
        }
        self.assertEqual(descriptors, expected)
        
        # Test with empty board
        board = [
            [False, False],
            [False, False]
        ]
        
        descriptors = NonogramDataManager.calculate_descriptors(board)
        expected = {
            "rows": [[0], [0]],
            "columns": [[0], [0]]
        }
        self.assertEqual(descriptors, expected)
        
        # Test with more complex pattern
        board = [
            [True, False, True],
            [False, False, False],
            [True, True, True]
        ]
        
        descriptors = NonogramDataManager.calculate_descriptors(board)
        expected = {
            "rows": [[1, 1], [0], [3]],
            "columns": [[2], [1], [2]]
        }
        self.assertEqual(descriptors, expected)
    
    def test_create_nonogram(self):
        """Test creating a new nonogram."""
        # Create a nonogram
        new_nonogram = NonogramCreate(
            name="new_test",
            board=[
                [True, False],
                [False, True]
            ]
        )
        
        result = self.data_manager.create_nonogram(new_nonogram)
        
        self.assertEqual(result.name, "new_test")
        self.assertEqual(result.board, [[True, False], [False, True]])
        self.assertEqual(result.descriptors, {
            "rows": [[1], [1]],
            "columns": [[1], [1]]
        })


if __name__ == "__main__":
    unittest.main() 