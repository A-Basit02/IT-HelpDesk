import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";


// Base API URL
const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/auth";


// Login
export const login = createAsyncThunk(
  "auth/loginUser",
  async ({ employeeID, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/login`, { employeeID, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, employeeID, email, password, department, branch, role }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/register`, {
        name, employeeID, email, password, department, branch, role
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Get Logged In User (used after page refresh)
export const getLoggedInUser = createAsyncThunk(
  "auth/getLoggedInUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me"); // Token added automatically
      // Update token in localStorage if returned
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        // console.log ("token = ", res.data.token)
      }
      return res.data.user; // or res.data depending on backend
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    message: null,
    isInitialized: false, 
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.message = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.token = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Logged In User
      .addCase(getLoggedInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        // console.log("getLoggedInUser fulfilled, payload:", action.payload);
        state.loading = false;
        state.user = action.payload;
        // Update token in state from localStorage
        state.token = localStorage.getItem("token");
        state.isInitialized = true;  
      })
      .addCase(getLoggedInUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        state.isInitialized = true; 
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
