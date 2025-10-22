from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Sequence
from app.models.post import Post

class PostRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, description: str, author_id: int) -> Post:
        """Create a new post"""
        post = Post(
            description = description,
            author_id = author_id
        )

        self.db.add(post)
        await self.db.flush()
        await self.db.refresh(post, ['author'])

        return post
    
    async def get_all_posts(self) -> Sequence[Post]:
        """Get all posts ordered by creation date (newest first)"""
                
        query = select(Post).options(selectinload(Post.author)).order_by(Post.created_at.desc())
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def edit(self, post_id: int, description: str, author_id: int) -> Post:
        """Edit post"""
        query = select(Post).options(selectinload(Post.author)).where(Post.id == post_id)
        result = await self.db.execute(query)
        post = result.scalar_one_or_none()
        
        if post is None:
            raise ValueError("Post not found")
        
        if getattr(post, "author_id", None) != author_id:
            raise PermissionError("Not allowed to edit this post")
        
        post.description = description
        await self.db.flush()
        await self.db.refresh(post)

        return post