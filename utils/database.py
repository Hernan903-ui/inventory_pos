from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

def init_db(uri):
    engine = create_engine(uri)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    
    session_factory = sessionmaker(bind=engine)
    Session = scoped_session(session_factory)
    return Session

def get_db_session(uri=None):
    uri = uri or os.getenv('MYSQL_URI')
    if not uri:
        raise ValueError("Debe proporcionar una URI de base de datos o configurar la variable MYSQL_URI")
    
    engine = create_engine(uri)
    Session = sessionmaker(bind=engine)
    return Session()