import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "dev_secret_key_change_in_production_xyz_abc_123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    DATABASE_URL: str = "sqlite:///./grantflow.db"
    ANTHROPIC_API_KEY: str = ""
    UPLOAD_DIR: str = "./uploads"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
