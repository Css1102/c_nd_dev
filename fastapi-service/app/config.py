import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pydantic import field_validator, Field, PlainSerializer
from typing import Annotated
# Step 1: Detect environment
ENV = os.getenv("ENV", "local")

# Step 2: Load the correct .env file
env_path = f".env.{ENV}"
load_dotenv(dotenv_path=env_path)

# Step 3: Define settings class
class Settings(BaseSettings):
    ENV:str=ENV
    DB_URL: str
    ALLOWED_ORIGINS:Annotated[list[str],PlainSerializer(lambda v:','.join(v),return_type=str,when_used="json")
    ]=Field(default_factory=list)
    PORT_FASTAPI: int = 8000  # Optional default
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    class Config:
        env_file = env_path  # Pydantic fallback

settings = Settings()
