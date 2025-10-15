"""Database configuration and session management."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/recipes",
)

Base = declarative_base()


def ensure_postgres_database(db_url: str):
    """Ensure target PostgreSQL database exists; create it if missing."""
    try:
        url = make_url(db_url)
    except Exception:
        return
    
    if not url.get_backend_name().startswith("postgresql"):
        return
    
    db_name = url.database
    admin_url = url.set(database="postgres")
    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT", future=True)
    
    try:
        with admin_engine.connect() as conn:
            res = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname=:name"), 
                {"name": db_name}
            ).first()
            if not res:
                conn.execute(text(f'CREATE DATABASE "{db_name}"'))
                print(f"Created database: {db_name}")
    finally:
        admin_engine.dispose()


# Ensure database exists
ensure_postgres_database(DATABASE_URL)

# Create engine and session
engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


def get_db():
    """Dependency for FastAPI to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
