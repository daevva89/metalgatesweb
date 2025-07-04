import api from './api';

// Add logs to auth API functions to track authentication calls
// Description: Login user with email and password
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, data: { user: object, accessToken: string, refreshToken: string }, message: string }
export const loginUser = async (email: string, password: string) => {
  console.log('Auth API: Login request for email:', email)
  try {
    const response = await api.post('/api/auth/login', { email, password });
    console.log('Auth API: Login response received:', response.data)
    
    if (response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      console.log('Auth API: Storing tokens in localStorage')
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Auth API: Login error:', error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Register new user
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { success: boolean, data: { user: object, accessToken: string }, message: string }
export const registerUser = async (email: string, password: string) => {
  console.log('Auth API: Register request for email:', email)
  try {
    const response = await api.post('/api/auth/register', { email, password });
    console.log('Auth API: Register response received:', response.data)
    
    if (response.data.data && response.data.data.accessToken) {
      console.log('Auth API: Storing access token in localStorage')
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Auth API: Register error:', error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get current user profile
// Endpoint: GET /api/auth/me
// Request: {}
// Response: { success: boolean, data: { user: object }, message: string }
export const getCurrentUser = async () => {
  console.log('Auth API: Getting current user profile')
  try {
    const response = await api.get('/api/auth/me');
    console.log('Auth API: Current user response received:', response.data)
    return response.data.data;
  } catch (error) {
    console.error('Auth API: Get current user error:', error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Logout user
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logoutUser = () => {
  console.log('Auth API: Logging out user, clearing localStorage')
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};