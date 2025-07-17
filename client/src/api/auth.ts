import api from './api';

// Add logs to auth API functions to track authentication calls
// Description: Login user with email and password
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, data: { user: object, accessToken: string, refreshToken: string }, message: string }
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    
    // Store tokens in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Register new user
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { success: boolean, data: { user: object, accessToken: string }, message: string }
export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/register', { email, password });
    
    // Store access token in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Get current user profile
// Endpoint: GET /api/auth/me
// Request: {}
// Response: { success: boolean, data: { user: object }, message: string }
export const getCurrentUser = async (): Promise<UserProfileResponse> => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || "Unknown error");
  }
};

// Description: Logout user
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logoutUser = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};