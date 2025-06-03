#!/usr/bin/env python3
"""
Tests for BRX Performance Client List Scraper
Validates:
1. JSON schema of client data
2. Required fields presence
3. Data type validation
4. Sample data validation
"""

import os
import sys
import json
import unittest
from pathlib import Path
from jsonschema import validate, ValidationError

# Add the parent directory to sys.path to import the scrapers module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the client_list module
from scrapers.client_list import normalize_client_data

# Constants
SAMPLE_DATA_PATH = os.path.join(os.path.dirname(__file__), 'fixtures', 'sample_client_list.json')
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'client_list.json')

# Define the expected schema for client data
CLIENT_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "required": ["id", "name", "profileUrl", "status", "lastActive"],
        "properties": {
            "id": {"type": "string"},
            "name": {"type": "string"},
            "profileUrl": {"type": "string"},
            "status": {"type": "string"},
            "lastActive": {"type": "string", "format": "date-time"}
        },
        "additionalProperties": False
    }
}

class TestClientList(unittest.TestCase):
    """Test cases for the client list scraper"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Create fixtures directory if it doesn't exist
        fixtures_dir = os.path.join(os.path.dirname(__file__), 'fixtures')
        os.makedirs(fixtures_dir, exist_ok=True)
        
        # Create sample client data for testing if it doesn't exist
        if not os.path.exists(SAMPLE_DATA_PATH):
            sample_data = [
                {
                    "id": "client123",
                    "name": "John Doe", 
                    "profileUrl": "/ex4/dashboard/trainer/clients/client123/",
                    "status": "Active",
                    "lastActive": "2025-05-25T14:30:00Z"
                },
                {
                    "id": "client456",
                    "name": "Jane Smith",
                    "profileUrl": "/ex4/dashboard/trainer/clients/client456/",
                    "status": "Inactive",
                    "lastActive": "2025-05-20T09:15:00Z"
                }
            ]
            
            with open(SAMPLE_DATA_PATH, 'w') as f:
                json.dump(sample_data, f, indent=2)
    
    def test_schema_validation(self):
        """Test that the sample data conforms to the expected schema"""
        with open(SAMPLE_DATA_PATH, 'r') as f:
            data = json.load(f)
        
        # Validate data against schema
        try:
            validate(instance=data, schema=CLIENT_SCHEMA)
            is_valid = True
        except ValidationError as e:
            print(f"Validation error: {e}")
            is_valid = False
            
        self.assertTrue(is_valid, "Sample data does not conform to schema")
    
    def test_required_fields(self):
        """Test that all required fields are present in sample data"""
        with open(SAMPLE_DATA_PATH, 'r') as f:
            data = json.load(f)
        
        required_fields = ["id", "name", "profileUrl", "status", "lastActive"]
        
        for client in data:
            for field in required_fields:
                self.assertIn(field, client, f"Required field '{field}' missing from client data")
    
    def test_data_types(self):
        """Test that data types are correct for all fields"""
        with open(SAMPLE_DATA_PATH, 'r') as f:
            data = json.load(f)
        
        for client in data:
            self.assertIsInstance(client["id"], str, "id should be a string")
            self.assertIsInstance(client["name"], str, "name should be a string")
            self.assertIsInstance(client["profileUrl"], str, "profileUrl should be a string")
            self.assertIsInstance(client["status"], str, "status should be a string")
            self.assertIsInstance(client["lastActive"], str, "lastActive should be a string")
    
    def test_normalize_client_data(self):
        """Test the normalize_client_data function with mock raw data"""
        # Create mock FireCrawl response
        mock_raw_data = {
            "html": "<div class='client-table'><tr><td>John Doe</td></tr></div>"
        }
        
        # Call the normalize function
        clients = normalize_client_data(mock_raw_data)
        
        # Check that the function returns data
        self.assertIsNotNone(clients, "normalize_client_data should return non-None result")
        self.assertIsInstance(clients, list, "normalize_client_data should return a list")
        
    def test_output_file_if_exists(self):
        """Test the structure of the output file if it exists"""
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r') as f:
                data = json.load(f)
            
            # Validate data against schema
            try:
                validate(instance=data, schema=CLIENT_SCHEMA)
                is_valid = True
            except ValidationError as e:
                print(f"Validation error in output file: {e}")
                is_valid = False
                
            self.assertTrue(is_valid, "Output file data does not conform to schema")
            
            # Check that there's at least some data
            self.assertGreater(len(data), 0, "Output file should contain at least one client")

if __name__ == '__main__':
    unittest.main()

