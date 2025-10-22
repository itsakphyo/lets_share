"""
Database configuration and connection management.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import MetaData, text
from typing import AsyncGenerator
import logging

from app.core.config import get_config

logger = logging.getLogger(__name__)

# Declarative base for all models
Base = declarative_base()

# Naming convention for constraints
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

Base.metadata = MetaData(naming_convention=convention)

class DatabaseManager:
    """Database connection manager"""
    
    def __init__(self):
        self.config = get_config()
        self.engine = None
        self.session_factory = None
    
    async def initialize(self):
        self.engine = create_async_engine(
            self.config.database.database_url,
            echo=self.config.is_development(),
            pool_size=self.config.database.max_open_conns,
            max_overflow=10,
            pool_timeout=30,
            pool_recycle=self.config.database.conn_max_lifetime,
            pool_pre_ping=True,
        )
        
        self.session_factory = async_sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False
        )
        
        logger.info("Database connection established")
    
    async def close(self):
        if self.engine:
            await self.engine.dispose()
            logger.info("Database connection closed")
    
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get database session with transaction management"""
        if self.session_factory is None:
            await self.initialize()
        
        session_factory = self.session_factory
        if session_factory is None:
            raise RuntimeError("Session factory is not initialized.")
        
        async with session_factory() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()


# Global database manager instance
db_manager = DatabaseManager()


# Dependency for FastAPI
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Database dependency for FastAPI"""
    async for session in db_manager.get_session():
        yield session


async def init_database():
    await db_manager.initialize()

async def close_database():
    await db_manager.close()