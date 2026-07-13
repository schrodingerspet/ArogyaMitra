from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    # Example test to ensure pytest framework is running
    assert True
