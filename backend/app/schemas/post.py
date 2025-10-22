from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.schemas.user import UserSummary

class PostBase(BaseModel):
    description : str

class CreatePost(PostBase):
    pass

class EditPost(PostBase):
    pass

class PostResponse(PostBase):
    id : int
    created_at : datetime
    updated_at: Optional[datetime] = None
    author: UserSummary

    model_config = ConfigDict(from_attributes=True)
