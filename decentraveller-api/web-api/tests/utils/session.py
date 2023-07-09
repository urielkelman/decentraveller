import os
import math

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import event

from src.orms import Base

def _fk_pragma_on_connect(dbapi_con, con_record):
    dbapi_con.execute('pragma foreign_keys=ON')
    dbapi_con.create_function('log', 1, math.log10)
    dbapi_con.create_function('pow', 1, math.pow)
    dbapi_con.create_function('radians', 1, math.radians)
    dbapi_con.create_function('sin', 1, math.sin)
    dbapi_con.create_function('cos', 1, math.cos)
    dbapi_con.create_function('asin', 1, math.asin)
    dbapi_con.create_function('sqrt', 1, math.sqrt)

def restart_database():
    global engine

    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

if os.path.exists('test.db'):
    os.remove('test.db')
if os.path.exists('test.db-journal'):
    os.remove('test.db-journal')

if "SQLALCHEMY_DATABASE_URL" in os.environ:
    SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

event.listen(engine, 'connect', _fk_pragma_on_connect)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
