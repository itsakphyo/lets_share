import React, { useState } from 'react';
import {
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { CreatePostForm } from '../components/features/posts/CreatePostDialog';
import { PostsList } from '../components/features/posts/PostsList';

export const FeedPage: React.FC = () => {
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);

  const handleOpenCreatePost = () => {
    setIsCreatePostDialogOpen(true);
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostDialogOpen(false);
  };

  const handleCreatePostSuccess = () => {
    setIsCreatePostDialogOpen(false);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Posts Feed Section */}
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <PostsList 
            testId="feed-posts-list"
            showCreatePostButton={true}
            onCreatePost={handleOpenCreatePost}
          />
        </Box>

        {/* Create Post Dialog */}
        <Dialog
          open={isCreatePostDialogOpen}
          onClose={handleCloseCreatePost}
          maxWidth="sm"
          fullWidth
          data-testid="create-post-dialog"
        >
          <DialogTitle>Create a new post</DialogTitle>
          <DialogContent>
            <CreatePostForm
              onSuccess={handleCreatePostSuccess}
              onCancel={undefined} // Dialog handles cancel
              placeholder="What's on your mind? Share your thoughts with the community..."
              showActions={false} // Dialog will handle actions
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreatePost}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              type="submit" 
              form="create-post-form"
            >
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default FeedPage;