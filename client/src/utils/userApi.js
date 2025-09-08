import axiosInstance from './axiosInstance';

// Get all users (admins only)
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users/all');
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' };
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/profile/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Update current user profile
export const updateCurrentUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/users/profile/me', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Create new user (admin only)
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create user' };
  }
}; 

export const updateUserStatus = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/approval`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' };
  }
};