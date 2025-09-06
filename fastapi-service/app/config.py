import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Only load .env files locally
ENV = os.getenv("ENV", "local")
if ENV == "local":
    load_dotenv(dotenv_path=".env.local")
elif ENV == "production":
    load_dotenv(dotenv_path=".env.production")

class Settings(BaseSettings):
    ENV: str = ENV
    DB_URL: str
    ALLOWED_ORIGINS: str
    PORT_FASTAPI: int = 8000

settings = Settings()
