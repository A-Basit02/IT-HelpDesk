import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userApi from '../utils/userApi';

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserById(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserById = createAsyncThunk(
  'users/updateUserById',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(userId, userData);
      return { userId, userData, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'users/deleteUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteUser(userId);
      return { userId, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewUser = createAsyncThunk(
  'users/createNewUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCurrentUserProfile = createAsyncThunk(
  'users/fetchCurrentUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getCurrentUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCurrentUserProfile = createAsyncThunk(
  'users/updateCurrentUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateCurrentUserProfile(profileData);
      return { profileData, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserStatusById = createAsyncThunk(
  'users/updateUserStatusById',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserStatus(userId, userData);
      return { userId, userData, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  users: [],
  currentUserProfile: null,
  selectedUser: null,
  loading: false,
  error: null,
  success: null,
  searchTerm: '',
  filterRole: 'all',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterRole: (state, action) => {
      state.filterRole = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    resetUserState: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.searchTerm = '';
      state.filterRole = 'all';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.success = action.payload.message;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })
      
      // Update user
      .addCase(updateUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, userData } = action.payload;
        state.users = state.users.map(user => 
          user.id === userId ? { ...user, ...userData } : user
        );
        state.success = action.payload.response.message;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user';
      })
      
      // Delete user
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.payload;
        state.users = state.users.filter(user => user.id !== userId);
        state.success = action.payload.response.message;
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
      })
      
      // Create new user
      .addCase(createNewUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create user';
      })
      
      // Fetch current user profile
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserProfile = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      
      // Update current user profile
      .addCase(updateCurrentUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { profileData } = action.payload;
        if (state.currentUserProfile) {
          state.currentUserProfile = { ...state.currentUserProfile, ...profileData };
        }
        state.success = action.payload.response.message;
      })
      .addCase(updateCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })

       // Update user Status
      .addCase(updateUserStatusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatusById.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, userData } = action.payload;
        state.users = state.users.map(user => 
          user.id === userId ? { ...user, ...userData } : user
        );
        state.success = action.payload.response.message;
      })
      .addCase(updateUserStatusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user';
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setSearchTerm,
  setFilterRole,
  setSelectedUser,
  clearSelectedUser,
  resetUserState
} = userSlice.actions;

export default userSlice.reducer; 