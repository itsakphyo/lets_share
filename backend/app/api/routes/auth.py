#routes
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.config import get_config
from app.schemas.user import (
    UserCreate, UserResponse, LoginResponse, LoginRequest, RefreshTokenRequest, TokenResponse
)
from app.services.user import UserService
from app.models.user import User
import jwt  # Add this import for JWT decoding

router = APIRouter()

config = get_config()

@router.post("/signup", response_model=UserResponse)
async def signup_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Signup a new user"""
    try:
        user_service = UserService(db)
        return await user_service.create_user(user_data)
        
    except Exception as e:        
        if "already exists" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, 
                detail="User with this email already exists"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Failed to create user"
            )
        
@router.post("/login", response_model=LoginResponse)
async def login_user(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Login a new user"""
    try:
        user_service = UserService(db)
        return await user_service.login(login_data)
        
    except Exception as e:
        print(f"fail to login {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to login"
        )
    
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Decode refresh token
        payload = jwt.decode(
            refresh_data.refresh_token, 
            config.jwt.refresh_secret, 
            algorithms=[config.jwt.algorithm]
        )
        
        user_id = payload.get("sub")
        token_type = payload.get("type")
        
        if token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
            
        user_service = UserService(db)
        new_access_token = user_service.create_access_token(
            data={"sub": user_id, "email": payload.get("email")}
        )
        
        return {"access_token": new_access_token, "token_type": "bearer"}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")