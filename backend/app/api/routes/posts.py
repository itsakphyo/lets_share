from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.post import PostResponse, CreatePost, EditPost
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.post import PostService
from app.api.dependencies.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter()


@router.get("/posts", response_model=List[PostResponse])
async def get_all_posts(
    db: AsyncSession = Depends(get_db)
):
    try:
        post_service = PostService(db)
        return await post_service.get_all_posts()
    
    except Exception as e:
        print(f"Error fetching posts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to fetch posts"
        )


@router.post("/posts", response_model=PostResponse)
async def create_post(
    post_data: CreatePost,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        post_service = PostService(db)
        return await post_service.create_post(post_data, current_user.id)
    
    except Exception as e:
        print(f"Error creating post: {e}")
        raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Failed to create post"
            )
    
@router.put("/posts/{post_id}", response_model=PostResponse)
async def edit_post(
    post_id: int,
    post_data: EditPost,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        post_service = PostService(db)
        return await post_service.edit_post(post_id, post_data, current_user.id)
    except Exception as e:
        print(f"Error editing post: {e}")
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail= "Failed to edit post"
        )