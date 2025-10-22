import { create } from 'zustand';
import { postsService } from '../services/api';
import type { 
  PostsState,
  PostResponse, 
  CreatePostRequest,
  ApiError 
} from '../types';

interface PostsActions {
  // Data fetching actions
  fetchPosts: () => Promise<void>;
  createPost: (postData: CreatePostRequest) => Promise<PostResponse>;
  searchPosts: (query: string) => Promise<void>;
  
  // State management actions
  setPosts: (posts: PostResponse[]) => void;
  addPost: (post: PostResponse) => void;
  editPost: (postId: number, updates: PostResponse) => void;
  removePost: (postId: number) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Pagination actions (prepared for future use)
  loadMorePosts: () => Promise<void>;
  resetPagination: () => void;
  
  // Utility actions
  reset: () => void;
  refresh: () => Promise<void>;
}

type PostsStore = PostsState & PostsActions;

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

export const usePostsStore = create<PostsStore>((set, get) => ({
  ...initialState,

  // Data fetching actions
  fetchPosts: async (): Promise<void> => {
    const state = get();
    if (state.isLoading) return; // Prevent concurrent fetches
    
    set({ isLoading: true, error: null });
    
    try {
      const posts = await postsService.getAllPosts();
      
      set({
        posts: posts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
        isLoading: false,
        error: null,
        hasMore: false, // All posts loaded at once
        page: 1,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.detail,
        posts: [],
      });
    }
  },

  createPost: async (postData: CreatePostRequest): Promise<PostResponse> => {
    set({ isLoading: true, error: null });
    
    try {
      const newPost = await postsService.createPost(postData);
      
      // Add new post to the beginning of the list
      const { posts } = get();
      set({
        posts: [newPost, ...posts],
        isLoading: false,
        error: null,
      });
      
      return newPost;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.detail,
      });
      throw error;
    }
  },

  searchPosts: async (query: string): Promise<void> => {
    set({ isLoading: true, error: null });
    
    try {
      const posts = await postsService.searchPosts(query);
      
      set({
        posts: posts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.detail,
      });
    }
  },

  // State management actions
  setPosts: (posts: PostResponse[]) => {
    set({ posts });
  },

  addPost: (post: PostResponse) => {
    const { posts } = get();
    set({ posts: [post, ...posts] });
  },

  editPost: async (postId: number, updates: CreatePostRequest): Promise<PostResponse> => {
    set({ isLoading: true, error: null });
    try {
      const response = await postsService.editPost(String(postId), updates);
      const { posts } = get();
      const updatedPosts = posts.map((post: PostResponse) =>
        post.id === postId ? { ...post, ...response } : post
      );
      set({ posts: updatedPosts, isLoading: false });
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      set({ isLoading: false, error: apiError.detail });
      throw error;
    }
  },

  removePost: (postId: number) => {
    const { posts } = get();
    const filteredPosts = posts.filter((post: PostResponse) => post.id !== postId);
    set({ posts: filteredPosts });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Pagination actions (prepared for future infinite scroll)
  loadMorePosts: async (): Promise<void> => {
    const { page, hasMore, isLoading } = get();
    
    if (isLoading || !hasMore) return;
    
    set({ isLoading: true });
    
    try {
      const { posts: newPosts, hasMore: moreAvailable } = 
        await postsService.getPostsPaginated(page + 1);
      
      const { posts: currentPosts } = get();
      
      set({
        posts: [...currentPosts, ...newPosts],
        page: page + 1,
        hasMore: moreAvailable,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.detail,
      });
    }
  },

  resetPagination: () => {
    set({
      page: 1,
      hasMore: true,
    });
  },

  // Utility actions
  reset: () => {
    set(initialState);
  },

  refresh: async (): Promise<void> => {
    const state = get();
    if (state.isLoading) return; // Prevent concurrent refreshes
    
    get().resetPagination();
    await get().fetchPosts();
  },
}));

// Selectors for convenient access to specific state slices
export const usePostsActions = () => usePostsStore((state) => ({
  fetchPosts: state.fetchPosts,
  createPost: state.createPost,
  searchPosts: state.searchPosts,
  loadMorePosts: state.loadMorePosts,
  refresh: state.refresh,
  setError: state.setError,
  clearError: state.clearError,
}));

// Additional selectors for specific use cases
export const usePostById = (postId: number) => usePostsStore((state) => 
  state.posts.find((post: PostResponse) => post.id === postId)
);

export const usePostsByAuthor = (authorId: number) => usePostsStore((state) => 
  state.posts.filter((post: PostResponse) => post.author.id === authorId)
);