from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Base


# Create an SQLite database
engine = create_engine('sqlite:///CapitolDB.db')

# Create all tables
Base.metadata.create_all(engine)

# Create a session factory
Session = sessionmaker(bind=engine)
