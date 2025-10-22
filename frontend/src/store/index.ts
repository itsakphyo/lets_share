// Auth Store
export {
  useAuthStore,
  useAuthActions,
} from './auth.store';

// Posts Store
export {
  usePostsStore,
  usePostsActions,
  usePostById,
  usePostsByAuthor,
} from './posts.store';

// Store initialization utility
export const initializeStores = async () => {
  const { useAuthStore } = await import('./auth.store');
  await useAuthStore.getState().initialize();  
};

// Store reset utility (useful for testing or logout)
export const resetStores = async () => {
  const { useAuthStore } = await import('./auth.store');
  const { usePostsStore } = await import('./posts.store');
  
  useAuthStore.getState().reset();
  usePostsStore.getState().reset();
};