"""
Authentication dependencies for FastAPI routes.
"""
import jwt
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_config
from app.core.database import get_db
from app.repositories.user import UserRepository
from app.models.user import User

config = get_config()
security = HTTPBearer()


class AuthenticationError(HTTPException):
    """Custom authentication exception"""
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Decode JWT token
        payload = jwt.decode(
            token, 
            config.jwt.secret_key, 
            algorithms=[config.jwt.algorithm]
        )
        
        # Extract user ID from token payload
        user_id: str = payload.get("sub")
        if user_id is None:
            raise AuthenticationError("Token payload invalid")
            
        # Convert user_id to integer
        try:
            user_id_int = int(user_id)
        except ValueError:
            raise AuthenticationError("Invalid user ID in token")
        
    except jwt.ExpiredSignatureError:
        raise AuthenticationError("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationError("Invalid token")
    except Exception:
        raise AuthenticationError("Could not validate credentials")
    
    # Get user from database
    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id_int)
    
    if user is None:
        raise AuthenticationError("User not found")
        
    return user
