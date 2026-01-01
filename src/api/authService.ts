import { User } from '@/types';
import { API_BASE_URL, getHeaders, handleResponse } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  async register(userData: User): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async validateToken(token: string): Promise<User | null> {
    // In a real app, you might have a /me endpoint. 
    // For now, we'll trust the stored user data if the token exists, 
    // or you could add a verify endpoint to your backend.
    if (!token) return null;

    // Optional: Verify with backend
    // const response = await fetch(`${API_BASE_URL}/auth/verify`, { headers: getHeaders() });
    // return response.ok ? response.json() : null;

    return null; // Rely on local storage for now to keep it simple
  },

  async logout(): Promise<void> {
    // Client-side only logout
  },
};
