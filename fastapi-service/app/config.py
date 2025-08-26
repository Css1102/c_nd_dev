import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Step 1: Detect environment
ENV = os.getenv("ENV", "local")

# Step 2: Load the correct .env file
env_path = f".env.{ENV}"
load_dotenv(dotenv_path=env_path)

# Step 3: Define settings class
class Settings(BaseSettings):
    ENV:str='local'
    DB_URL: str
    ALLOWED_ORIGINS: str
    PORT_FASTAPI: int = 8000  # Optional default

    class Config:
        env_file = env_path  # Pydantic fallback

settings = Settings()
