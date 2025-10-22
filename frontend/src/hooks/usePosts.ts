import { useEffect, useCallback, useRef } from 'react';
import { usePostsStore, usePostById } from '../store';
import type { CreatePostRequest, PostResponse } from '../types';

interface UsePostsReturn {
  // State
  posts: PostResponse[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  
  // Actions
  createPost: (postData: CreatePostRequest) => Promise<PostResponse>;
  editPost: (postId: number, updates: PostResponse) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  clearError: () => void;
  
  // Utilities
  getPostById: (id: number) => PostResponse | undefined;
  postsCount: number;
}

export const usePosts = (): UsePostsReturn => {
  // Use stable selectors to avoid infinite loops
  const posts = usePostsStore(state => state.posts);
  const isLoading = usePostsStore(state => state.isLoading);
  const error = usePostsStore(state => state.error);
  const hasMore = usePostsStore(state => state.hasMore);
  const fetchPosts = usePostsStore(state => state.fetchPosts);
  const createPostAction = usePostsStore(state => state.createPost);
  const searchPostsAction = usePostsStore(state => state.searchPosts);
  const refreshPostsAction = usePostsStore(state => state.refresh);
  const clearPostsError = usePostsStore(state => state.clearError);
  const editPostAction = usePostsStore(state => state.editPost);

  // Track if we've already tried to fetch to prevent duplicate calls
  const hasTriedToFetch = useRef(false);

  // Load posts on mount - only check if we need to fetch
  useEffect(() => {
    if (posts.length === 0 && !isLoading && !error && !hasTriedToFetch.current) {
      hasTriedToFetch.current = true;
      fetchPosts();
    }
  }, [posts.length, isLoading, error]);

  // Enhanced create post with optimistic updates
  const createPost = useCallback(async (postData: CreatePostRequest): Promise<PostResponse> => {
    try {
      const newPost = await createPostAction(postData);
      return newPost;
    } catch (error) {
      throw error;
    }
  }, [createPostAction]);

  // Enhanced edit post with optimistic updates
  const editPost = useCallback(async (postId: number, updates: PostResponse): Promise<void> => {
    try {
      await editPostAction(postId, updates);
    } catch (error) {
      throw error;
    }
  }, [editPostAction]);

  // Enhanced search with debouncing handled externally
  const searchPosts = useCallback(async (query: string): Promise<void> => {
    try {
      await searchPostsAction(query);
    } catch (error) {
      // Error handled by store
    }
  }, [searchPostsAction]);

  // Refresh posts
  const refreshPosts = useCallback(async (): Promise<void> => {
    try {
      await refreshPostsAction();
    } catch (error) {
      // Error handled by store
    }
  }, [refreshPostsAction]);

  // Get specific post by ID
  const getPostById = useCallback((id: number) => {
    return posts.find((post: PostResponse) => post.id === id);
  }, [posts]);

  return {
    // State
    posts,
    isLoading,
    error,
    hasMore,
    
    // Actions
    createPost,
    editPost,
    searchPosts,
    refreshPosts,
    clearError: clearPostsError,
    
    // Utilities
    getPostById,
    postsCount: posts.length,
  };
};

// Hook for managing a specific post
export const usePost = (postId: number) => {
  const post = usePostById(postId);
  const isLoading = usePostsStore(state => state.isLoading);
  const error = usePostsStore(state => state.error);
  
  return {
    post,
    isLoading,
    error,
    exists: !!post,
  };
};