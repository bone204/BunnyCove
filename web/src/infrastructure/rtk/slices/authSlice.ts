import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../domain/entities/user.entity";
import { HttpClient } from "../../http/http-client";
import { StorageKeys } from "../../constants/defaults";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getInitialUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(StorageKeys.userProfile);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = HttpClient.getAccessToken();
      const user = getInitialUser();
      state.accessToken = token;
      state.user = user;
      state.isAuthenticated = !!token;
      state.isLoading = false;
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      HttpClient.setAccessToken(accessToken);
      if (refreshToken) {
        HttpClient.setRefreshToken(refreshToken);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.userProfile, JSON.stringify(user));
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.userProfile, JSON.stringify(action.payload));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      HttpClient.clearTokens();
    },
  },
});

export const { initializeAuth, setCredentials, setUser, setLoading, logout } =
  authSlice.actions;

export default authSlice.reducer;

