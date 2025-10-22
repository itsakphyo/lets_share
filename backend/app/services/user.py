"""
User service layer for handling business logic.
"""
import uuid
import secrets
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from fastapi import HTTPException, status

from app.repositories.user import UserRepository
from app.models.user import User
from app.schemas.user import (
    UserCreate, UserResponse, LoginResponse, LoginRequest
)
from app.core.config import get_config

config = get_config()

class UserService:
    """
    User service layer handling all user-related business logic.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        try:
            return self.pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            print(f"Error verifying password: {e}")
            return False
    
    def get_password_hash(self, password: str) -> str:
        """Generate password hash"""
        try:
            return self.pwd_context.hash(password)
        except Exception as e:
            print(f"Error hashing password: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error processing password"
            )
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        try:
            user = await self.user_repo.get_by_email(email)
            if not user or not self.verify_password(password, str(user.password_hash)):
                return None
            
            return user
        except Exception as e:
            print(f"Error authenticating user: {e}")
            return None
    
    def create_access_token(self, data: dict) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        duration = config.jwt.access_token_duration
        expire = datetime.now(timezone.utc) + timedelta(seconds=duration)
        
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, config.jwt.secret_key, config.jwt.algorithm)
    
    def create_refresh_token(self, data: dict) -> str:
        """Create JWT refresh token"""
        to_encode = data.copy()
        duration = config.jwt.refresh_token_duration
        expire = datetime.now(timezone.utc) + timedelta(seconds=duration)

        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, config.jwt.refresh_secret, config.jwt.algorithm)
    

    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user"""
        try:
            existing_user = await self.user_repo.get_by_email(user_data.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="User with this email already exists"
                )
            
            password_hash = self.get_password_hash(user_data.password)
            
            user = await self.user_repo.create(
                email=user_data.email,
                full_name=user_data.full_name,
                password_hash=password_hash
            )
            
            await self.db.commit()
            return UserResponse.model_validate(user)
            
        except Exception as e:
            print(f"Error creating user: {e}")
            # Rollback the transaction on error
            await self.db.rollback()
            raise

    async def login(self, login_data: LoginRequest) -> LoginResponse:
        """User login"""
        try:
            user = await self.authenticate_user(login_data.email, login_data.password)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials or user does not exist."
                )
            
            # Create tokens
            access_token = self.create_access_token(
                data={"sub": str(user.id), "email": user.email}
            )
            refresh_token = self.create_refresh_token(
                data={"sub": str(user.id), "type": "refresh"}
            )
            
            return LoginResponse(
                user=UserResponse.model_validate(user),
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=config.jwt.access_token_duration,
                token_type="Bearer"
            )
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            print(f"Error during login: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error during authentication"
            )
 