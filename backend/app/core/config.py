from typing import List, Optional
from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="APP_",
        env_file=".env",
        case_sensitive=False
    )
    
    name: str = Field(default="Let's Share API")
    debug: bool = Field(default=False)
    version: str = Field(default="1.0.0")
    environment: str = Field(default="development")


class ServerConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="SERVER_",
        env_file=".env",
        case_sensitive=False
    )
    
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000)
    read_timeout: int = Field(default=30)
    write_timeout: int = Field(default=30)
    idle_timeout: int = Field(default=120)
    workers: int = Field(default=4)
    trusted_proxies: List[str] = Field(default_factory=list)


class DatabaseConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="DB_",
        env_file=".env",
        case_sensitive=False
    )
    
    host: str = Field(default="localhost")
    port: int = Field(default=5432)
    user: str = Field(default="akp")
    password: str = Field(default="")
    name: str = Field(default="letsshare_db")
    ssl_mode: str = Field(default="disable")
    max_open_conns: int = Field(default=25)
    max_idle_conns: int = Field(default=5)
    conn_max_lifetime: int = Field(default=300)
    migration_path: str = Field(default="./alembic")

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"

    @property
    def sync_database_url(self) -> str:
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"


class JWTConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="JWT_",
        env_file=".env",
        case_sensitive=False
    )
    
    secret_key: str = Field(default="")
    refresh_secret: str = Field(default="")
    algorithm: str = Field(default="HS256")
    access_token_duration: int = Field(default=900)
    refresh_token_duration: int = Field(default=604800)

class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=False,
        extra="ignore"
    )
    
    # All configuration sections
    app: AppConfig = Field(default_factory=AppConfig)
    server: ServerConfig = Field(default_factory=ServerConfig)
    database: DatabaseConfig = Field(default_factory=DatabaseConfig)
    jwt: JWTConfig = Field(default_factory=JWTConfig)

    def is_development(self) -> bool:
        return self.app.environment == "development"
    
    def is_production(self) -> bool:
        return self.app.environment == "production"
    
    def is_staging(self) -> bool:
        return self.app.environment == "staging"
    
    def validate_config(self) -> None:
        if self.database.password == "":
            raise ValueError("Database password is required in production")
        
        if self.jwt.secret_key == "":
            raise ValueError("JWT secret key must be changed in production")
        
        if self.jwt.refresh_secret == "":
            raise ValueError("JWT secret key must be changed in production")


# Global configuration instance
_config: Optional[Config] = None


def get_config() -> Config:
    """Get global configuration instance"""
    global _config
    if _config is None:
        _config = Config()
        # Auto-validate in production
        if _config.is_production():
            _config.validate_config()
    return _config

