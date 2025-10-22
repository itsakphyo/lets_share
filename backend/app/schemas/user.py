from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional, Dict, List, Any, Union
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: EmailStr

class UserSummary(UserBase):
    """Minimal user info for nested objects (author, etc.)"""
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=128,
        description="Password must be between 8-128 characters"
    )

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v) > 128:
            raise ValueError('Password must be no more than 128 characters long')

        return v
    
class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "Bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"