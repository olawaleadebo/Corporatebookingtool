import api from '../lib/api';
import { User } from './auth.service';

class UserService {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    
    // Update local storage with fresh user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    
    // If updating current user, update local storage
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === id) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    }
    
    return response.data;
  }
}

export const userService = new UserService();
