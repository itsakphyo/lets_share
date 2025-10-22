import { apiClient } from './client';
import { API_CONFIG } from '../../config/constants';
import type { PostResponse, CreatePostRequest } from '../../types/api.types';

export class PostsService {
  /**
   * Get all posts
   */
  async getAllPosts(): Promise<PostResponse[]> {
    try {
      const response = await apiClient.get<PostResponse[]>(
        API_CONFIG.ENDPOINTS.POSTS.LIST
      );
      return response;
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Create a new post
   */
  async createPost(postData: CreatePostRequest): Promise<PostResponse> {
    try {
      const response = await apiClient.post<PostResponse>(
        API_CONFIG.ENDPOINTS.POSTS.CREATE,
        postData
      );
      return response;
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  async editPost(postId: string, postData: CreatePostRequest): Promise<PostResponse> {
    try {
      const response = await apiClient.put<PostResponse>(
        API_CONFIG.ENDPOINTS.POSTS.EDIT(String(postId)),
        postData
      );
      return response;
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Get posts with pagination (for future infinite scroll)
   */
  async getPostsPaginated(page = 1, limit = 10): Promise<{
    posts: PostResponse[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      // For now, this returns all posts since the API doesn't support pagination yet
      // This structure is prepared for future pagination implementation
      const posts = await this.getAllPosts();
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = posts.slice(startIndex, endIndex);
      
      return {
        posts: paginatedPosts,
        hasMore: endIndex < posts.length,
        total: posts.length,
      };
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Search posts by content (client-side filtering for now)
   */
  async searchPosts(query: string): Promise<PostResponse[]> {
    try {
      const allPosts = await this.getAllPosts();
      
      if (!query.trim()) {
        return allPosts;
      }

      const searchTerm = query.toLowerCase();
      return allPosts.filter(post =>
        post.description.toLowerCase().includes(searchTerm) ||
        post.author.full_name.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Get posts by a specific author
   */
  async getPostsByAuthor(authorId: number): Promise<PostResponse[]> {
    try {
      const allPosts = await this.getAllPosts();
      return allPosts.filter(post => post.author.id === authorId);
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }
}

// Create singleton instance
export const postsService = new PostsService();
export default postsService;