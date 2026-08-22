import os
from typing import List, Union
# pyrefly: ignore [missing-import]
from pydantic import field_validator
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    PROJECT_NAME: str = "Veridexa"
    APP_NAME: str = "Veridexa — AI-Powered Product Intelligence"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./veridexa.db"

    # AI / LLM
    LLM_PROVIDER: str = "mock"  # "mock" | "openai" | "anthropic" | "gemini"
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_TEMPERATURE: float = 0.0
    LLM_TIMEOUT_SECONDS: int = 25

    # Storage & Uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 15

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    # Logging
    LOG_LEVEL: str = "INFO"

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v: Union[bool, str, int, None]) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, (int, float)):
            return bool(v)
        if isinstance(v, str):
            val = v.strip().lower()
            if val in ("true", "1", "t", "yes", "y", "on", "debug", "enabled", "development"):
                return True
            if val in ("false", "0", "f", "no", "n", "off", "release", "production", "info", "warn", "warning", "error", "critical"):
                return False
        return False

    @field_validator("LOG_LEVEL", mode="before")
    @classmethod
    def parse_log_level(cls, v: Union[str, None]) -> str:
        if isinstance(v, str):
            v_upper = v.strip().upper()
            if v_upper in ("DEBUG", "INFO", "WARNING", "WARN", "ERROR", "CRITICAL"):
                return "WARNING" if v_upper == "WARN" else v_upper
        return "INFO"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str], None]) -> List[str]:
        if v is None or v == "":
            return ["*"]
        if isinstance(v, str):
            v = v.strip()
            if v == "*":
                return ["*"]
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return parsed
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        if isinstance(v, list):
            return v
        return ["*"]


settings = Settings()
