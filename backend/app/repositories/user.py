"""
User repository implementation.
"""
from typing import Optional, List, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from datetime import datetime
import uuid

from app.models.user import User


class UserRepository:
    """Repository for user operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email address"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def create(self, email: str, full_name: str, password_hash : str) -> User:
        """Create a new user"""
        user = User(
            email=email,
            full_name = full_name,
            password_hash = password_hash
        )

        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)

        return user