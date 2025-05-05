import json
import os
import tempfile
from fastapi.testclient import TestClient
import unittest
from unittest import mock

# Import the app and necessary modules
from app.core.crud import NonogramDataManager
from main import app


class TestNonogramAPI(unittest.TestCase):
    """Test cases for the Nonogram API endpoints."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a test client
        self.client = TestClient(app)
        
        # Create test data
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
        
        # Mock the data_manager in the nonograms module
        self.patcher = mock.patch('app.api.nonograms.data_manager')
        self.mock_data_manager = self.patcher.start()
        
        # Configure mock to return our test data
        self.mock_data_manager.get_all_names.return_value = list(self.test_data.keys())
        self.mock_data_manager.get_by_name.side_effect = lambda name: (
            mock.MagicMock(
                name=name, 
                board=self.test_data[name]["board"],
                descriptors=self.test_data[name]["descriptors"]
            ) if name in self.test_data else None
        )
        self.mock_data_manager.search_by_clue.side_effect = lambda clue: (
            ["test_nonogram"] if clue == "3" else 
            ["another_test"] if clue == "2" else []
        )
    
    def tearDown(self):
        """Tear down test fixtures."""
        # Stop the patcher
        self.patcher.stop()
    
    def test_root(self):
        """Test the root endpoint."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Welcome to the Nonogram Editor API"})
    
    def test_get_nonogram_list(self):
        """Test getting the list of nonograms."""
        response = self.client.get("/api/nonograms/list")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"names": ["test_nonogram", "another_test"]})
    
    def test_get_nonogram_by_name(self):
        """Test getting a specific nonogram by name."""
        response = self.client.get("/api/nonograms/test_nonogram")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "test_nonogram")
        self.assertEqual(data["board"], self.test_data["test_nonogram"]["board"])
        self.assertEqual(data["descriptors"], self.test_data["test_nonogram"]["descriptors"])
    
    def test_get_nonogram_not_found(self):
        """Test getting a nonogram that doesn't exist."""
        self.mock_data_manager.get_by_name.return_value = None
        response = self.client.get("/api/nonograms/nonexistent")
        self.assertEqual(response.status_code, 404)
        self.assertIn("detail", response.json())
    
    def test_search_nonograms(self):
        """Test searching for nonograms by clue."""
        # Test searching for clue "3"
        response = self.client.get("/api/nonograms/search?clue=3")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"matches": ["test_nonogram"]})
        
        # Test searching for clue "2"
        response = self.client.get("/api/nonograms/search?clue=2")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"matches": ["another_test"]})
        
        # Test searching for nonexistent clue
        response = self.client.get("/api/nonograms/search?clue=4")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"matches": []})
    
    def test_create_nonogram(self):
        """Test creating a new nonogram."""
        # Mock the create_nonogram method
        self.mock_data_manager.create_nonogram.return_value = mock.MagicMock(
            name="new_test",
            board=[[True, False], [False, True]],
            descriptors={
                "rows": [[1], [1]],
                "columns": [[1], [1]]
            }
        )
        
        # Test creating a nonogram
        response = self.client.post(
            "/api/nonograms/",
            json={
                "name": "new_test",
                "board": [[True, False], [False, True]]
            }
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "new_test")
        self.assertEqual(data["board"], [[True, False], [False, True]])
        self.assertEqual(data["descriptors"], {
            "rows": [[1], [1]],
            "columns": [[1], [1]]
        })


if __name__ == "__main__":
    unittest.main() 