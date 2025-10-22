import React, {useState} from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { EditPostDialog } from './EditPostDialog';
import type { PostResponse } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

interface PostCardProps {
  post: PostResponse;
  className?: string;
  testId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  className,
  testId,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const isAuthor = isAuthenticated && user?.id === post.author.id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  // Get author initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const isEdited = post.updated_at && post.updated_at !== post.created_at;

  return (
    <Card 
      className={className}
      data-testid={testId}
      elevation={1}
      sx={{ 
        mb: 2,
        '&:hover': {
          elevation: 2,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            {getInitials(post.author.full_name)}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
            {post.author.full_name}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.created_at)}
            </Typography>
            {isEdited && (
              <Chip 
                label="edited" 
                size="small" 
                variant="outlined"
                sx={{ 
                  height: 20,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  borderColor: 'text.secondary',
                }}
              />
            )}
          </Box>
        }
        sx={{ pb: 1 }}
        action={
          isAuthor && (
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          )
        }
      />

      <CardContent sx={{ pt: 0, pl: 9 }}>
        <Typography 
          variant="body1" 
          color="text.primary"
          sx={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.5,
          }}
        >
          {post.description}
        </Typography>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <EditPostDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        post={post}
      />
    </Card>
  );
};

export default PostCard;