import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
} from '@mui/material';
import { useForm } from '../../../hooks/useForm';
import { usePosts } from '../../../hooks/usePosts';
import { VALIDATION } from '../../../config/constants';
import type { CreatePostRequest } from '../../../types';

interface CreatePostFormData {
  description: string;
}

const initialValues: CreatePostFormData = {
  description: '',
};

const validationRules = {
  description: [
    { required: true },
    { minLength: VALIDATION.POST.MIN_LENGTH },
    { maxLength: VALIDATION.POST.MAX_LENGTH },
  ],
};

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  showActions?: boolean;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSuccess,
  onCancel,
  placeholder = "What's on your mind?",
  showActions = true,
}) => {
  const { createPost, isLoading, error, clearError } = usePosts();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    resetForm,
  } = useForm<CreatePostFormData>({
    initialValues,
    validationRules,
    onSubmit: async (formData) => {
      clearError();
      
      try {
        await createPost(formData as CreatePostRequest);
        resetForm();
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    },
  });

  const isOverLimit = values.description.length > VALIDATION.POST.MAX_LENGTH;
  const isNearLimit = values.description.length > VALIDATION.POST.MAX_LENGTH * 0.9;

  const canSubmit = isValid && !isLoading && !isOverLimit && values.description.trim();

  return (
    <Box component="form" id="create-post-form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid="create-post-error">
          {error}
        </Alert>
      )}

      <Box>
        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder={placeholder}
          value={values.description}
          onChange={(e) => handleChange('description')(e.target.value)}
          onBlur={() => handleBlur('description')}
          error={touched.description && !!errors.description}
          helperText={touched.description && errors.description}
          disabled={isLoading}
          inputProps={{ 'data-testid': 'create-post-textarea' }}
          sx={{ mb: 1 }}
        />
        
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'right',
            color: isOverLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'text.secondary'
          }}
        >
          {values.description.length} / {VALIDATION.POST.MAX_LENGTH}
        </Typography>
      </Box>

      {showActions && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              data-testid="create-post-cancel"
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit}
            data-testid="create-post-submit"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Dialog wrapper component with trigger button
interface CreatePostDialogProps {
  onSuccess?: () => void;
  placeholder?: string;
  testId?: string;
  triggerVariant?: 'button' | 'input';
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  onSuccess,
  placeholder = "What's on your mind?",
  testId,
  triggerVariant = 'input',
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const triggerButton = triggerVariant === 'button' ? (
    <Button
      variant="contained"
      onClick={handleOpenDialog}
      data-testid={testId}
      sx={{ whiteSpace: 'nowrap' }}
    >
      {placeholder}
    </Button>
  ) : (
    <Paper
      onClick={handleOpenDialog}
      data-testid={testId}
      elevation={1}
      sx={{
        p: 2,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        backgroundColor: 'grey.50',
        color: 'text.secondary',
        '&:hover': {
          backgroundColor: 'grey.100',
          borderColor: 'grey.400',
        },
        transition: 'all 0.2s ease-out',
      }}
    >
      <Typography variant="body2">
        {placeholder}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {triggerButton}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        data-testid="create-post-dialog"
      >
        <DialogTitle>Create a new post</DialogTitle>
        <DialogContent>
          <CreatePostForm
            onSuccess={handleSuccess}
            onCancel={handleCloseDialog}
            placeholder="What's on your mind? Share your thoughts with the community..."
            showActions={true}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreatePostDialog;