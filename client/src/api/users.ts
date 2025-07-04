import api from './api';

// Description: Create a new user with role
// Endpoint: POST /api/users
// Request: { email: string, password: string, role?: string }
// Response: { success: boolean, message: string, user: { _id: string, email: string, role: string, createdAt: string, lastLoginAt: string, isActive: boolean } }
export const createUser = async (data: { email: string; password: string; role?: string }) => {
  try {
    const response = await api.post('/api/users', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get current user profile with role information
// Endpoint: GET /api/users/me
// Request: {}
// Response: { success: boolean, user: { _id: string, email: string, role: string, createdAt: string, lastLoginAt: string, isActive: boolean } }
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get all users (admin only)
// Endpoint: GET /api/users
// Request: {}
// Response: { success: boolean, users: Array<{ _id: string, email: string, role: string, createdAt: string, lastLoginAt: string, isActive: boolean }> }
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};