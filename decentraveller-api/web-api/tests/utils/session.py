import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.orms import Base


def restart_database():
    global engine

    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

if "SQLALCHEMY_DATABASE_URL" in os.environ:
    SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
