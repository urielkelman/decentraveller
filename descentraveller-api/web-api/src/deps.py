from typing import Generator

def get_db() -> Generator:
    from src.database.session import SessionLocal

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()