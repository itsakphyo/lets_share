import React from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from '@mui/material';
import { Refresh as RefreshIcon, Add as AddIcon } from '@mui/icons-material';
import { PostCard } from './PostCard';
import { usePosts } from '../../../hooks/usePosts';
import type { PostResponse } from '../../../types';

interface PostsListProps {
  className?: string;
  testId?: string;
  showRefreshButton?: boolean;
  showCreatePostButton?: boolean;
  onCreatePost?: () => void;
}

const LoadingSpinner: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 8,
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress size={32} />
    <Typography variant="body1" color="text.secondary">
      Loading posts...
    </Typography>
  </Box>
);

const EmptyState: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 12,
      textAlign: 'center',
      gap: 2,
    }}
  >
    <Typography variant="h1" sx={{ fontSize: '48px', mb: 1 }}>
      📝
    </Typography>
    <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
      No posts yet
    </Typography>
    <Typography 
      variant="body1" 
      color="text.secondary" 
      sx={{ mb: 3, maxWidth: '400px' }}
    >
      Be the first to share your thoughts! Create a post above to get the conversation started.
    </Typography>
    {onRefresh && (
      <Button variant="outlined" onClick={onRefresh} startIcon={<RefreshIcon />}>
        Refresh
      </Button>
    )}
  </Box>
);

const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Paper sx={{ p: 4, m: 2, textAlign: 'center' }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '48px', mb: 1 }}>
        ⚠️
      </Typography>
      <Typography variant="h6" color="error" sx={{ fontWeight: 600, mb: 1 }}>
        Failed to load posts
      </Typography>
      <Typography variant="body1" color="error" sx={{ mb: 3, maxWidth: '400px' }}>
        {error}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  </Paper>
);

export const PostsList: React.FC<PostsListProps> = ({
  className,
  testId,
  showRefreshButton = true,
  showCreatePostButton = true,
  onCreatePost,
}) => {
  const { posts, isLoading, error, refreshPosts, clearError } = usePosts();

  // Load posts on component mount - removed unnecessary useEffect since usePosts already handles this

  const handleRefresh = async () => {
    clearError();
    await refreshPosts();
  };

  // Show loading state
  if (isLoading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error && posts.length === 0) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  return (
    <Box className={className} data-testid={testId} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Latest Posts {posts.length > 0 && `(${posts.length})`}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {showCreatePostButton && (
            <Button
              variant="contained"
              size="small"
              onClick={onCreatePost}
              startIcon={<AddIcon />}
              data-testid="create-post-button"
            >
              Create Post
            </Button>
          )}
          {showRefreshButton && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefresh}
              disabled={isLoading}
              startIcon={<RefreshIcon />}
              data-testid="refresh-posts"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Show error banner if there's an error but we have posts */}
      {error && posts.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Posts list */}
      {posts.length > 0 ? (
        <Stack spacing={2}>
          {posts.map((post: PostResponse) => (
            <PostCard
              key={post.id}
              post={post}
              testId={`post-${post.id}`}
            />
          ))}
        </Stack>
      ) : (
        <EmptyState onRefresh={showRefreshButton ? handleRefresh : undefined} />
      )}
    </Box>
  );
};

export default PostsList;