import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv('DEBUG', False)
    SECRET_KEY = os.getenv('SECRET_KEY')
    MYSQL_URI = os.getenv('MYSQL_URI')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')