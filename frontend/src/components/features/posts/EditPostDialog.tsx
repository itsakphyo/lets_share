import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm } from '../../../hooks/useForm';
import { usePosts } from '../../../hooks/usePosts';
import { VALIDATION } from '../../../config/constants';
import type { PostResponse } from '../../../types';

interface EditPostDialogProps {
  open: boolean;
  onClose: () => void;
  post: PostResponse;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({
    open,
    onClose,
    post,
}) => {
    const { editPost, isLoading, error, clearError } = usePosts();
    const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    resetForm,
  } = useForm<{ description: string }>({
    initialValues: { description: post.description },
    validationRules: {
      description: [
        { required: true },
        { minLength: VALIDATION.POST.MIN_LENGTH },
        { maxLength: VALIDATION.POST.MAX_LENGTH },
      ],
    },
    onSubmit: async (formData) => {
      clearError();
      try {
        await editPost(post.id, formData as PostResponse);
        resetForm();
        onClose();
      } catch (error) {
        console.error('Failed to edit post:', error);
      }
    },
  });

  const isOverLimit = values.description.length > VALIDATION.POST.MAX_LENGTH;
  const isNearLimit = values.description.length > VALIDATION.POST.MAX_LENGTH * 0.9;
  const canSubmit = isValid && !isLoading && !isOverLimit && values.description.trim();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      data-testid="edit-post-dialog"
    >
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <Box component="form" id="edit-post-form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            multiline
            rows={6}
            fullWidth
            placeholder="Edit your post..."
            value={values.description}
            onChange={(e) => handleChange('description')(e.target.value)}
            onBlur={() => handleBlur('description')}
            error={touched.description && !!errors.description}
            helperText={touched.description && errors.description}
            disabled={isLoading}
            sx={{ mb: 1, mt: 2 }}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-post-form"
          variant="contained"
          disabled={!canSubmit}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}