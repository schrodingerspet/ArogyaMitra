# Simple DB init (SQLite) - run inside backend venv
from sqlalchemy import create_engine, text
import os

DB_URL = os.getenv('DATABASE_URL', 'sqlite:///./arogya.db')
engine = create_engine(DB_URL, echo=True)

with engine.connect() as conn:
    conn.execute(text('CREATE TABLE IF NOT EXISTS health_profiles (id INTEGER PRIMARY KEY, user_name TEXT)'))
    conn.commit()
print('DB initialized')
