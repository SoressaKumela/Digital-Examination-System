import { User, DashboardStats } from '@/types';
import { API_BASE_URL, getHeaders, handleResponse } from './config';

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async createUser(userData: Omit<User, 'userId' | 'createdAt'>): Promise<User> {
    // Admin creating a user is essentially registration
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
