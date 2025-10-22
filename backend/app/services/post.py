from typing import Union, List
from sqlalchemy import Column
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.post import CreatePost, PostResponse, EditPost
from app.repositories.post import PostRepository

class PostService():
    def __init__(self, db: AsyncSession):
        self.db = db
        self.post_repo = PostRepository(db)

    async def create_post(self, post_data: CreatePost, author_id):
        try:
            post = await self.post_repo.create(            
                description=post_data.description,
                author_id=author_id
            )

            await self.db.commit()
            return PostResponse.model_validate(post)
        
        except Exception as e:
            print(f"Error creating post: {e}")
            # Rollback the transaction on error
            await self.db.rollback()
            raise

    async def get_all_posts(self) -> List[PostResponse]:
        """Get all posts"""
        try:
            posts = await self.post_repo.get_all_posts()
            return [PostResponse.model_validate(post) for post in posts]
        
        except Exception as e:
            print(f"Error fetching posts: {e}")
            raise

    async def edit_post(self, post_id: int, post_data: EditPost, author_id):
        try:
            post = await self.post_repo.edit(
                post_id = post_id,
                description= post_data.description,
                author_id= author_id
            )
            await self.db.commit()
            return PostResponse.model_validate(post)
        
        except Exception as e:
            print(f"Error editing post {e}")
            await self.db.rollback()
            raise