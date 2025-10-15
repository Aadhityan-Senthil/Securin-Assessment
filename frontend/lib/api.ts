import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Recipe {
  id: number;
  title: string;
  cuisine: string | null;
  rating: number | null;
  prep_time: number | null;
  cook_time: number | null;
  total_time: number | null;
  description: string | null;
  nutrients: {
    calories?: string;
    carbohydrateContent?: string;
    cholesterolContent?: string;
    fiberContent?: string;
    proteinContent?: string;
    saturatedFatContent?: string;
    sodiumContent?: string;
    sugarContent?: string;
    fatContent?: string;
  } | null;
  serves: string | null;
}

export interface PaginatedResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: Recipe[];
}

export interface SearchParams {
  page?: number;
  limit?: number;
  title?: string;
  cuisine?: string;
  rating?: string;
  total_time?: string;
  calories?: string;
}

export const recipesApi = {
  getRecipes: async (page: number = 1, limit: number = 15): Promise<PaginatedResponse> => {
    const response = await api.get('/recipes', {
      params: { page, limit },
    });
    return response.data;
  },

  searchRecipes: async (params: SearchParams): Promise<PaginatedResponse> => {
    const response = await api.get('/recipes/search', { params });
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
