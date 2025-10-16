"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Auth states
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    
    if (token && user) {
      try {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: JSON.parse(user),
          },
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  // Login function
  const login = async (credentials, isAdmin = false) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = isAdmin 
        ? await apiService.adminLogin(credentials)
        : await apiService.login(credentials);

      if (response.success) {
        const { token, user, admin } = response.data;
        const userData = user || admin;

        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_type', isAdmin ? 'admin' : 'user');

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token, user: userData },
        });

        return { success: true, user: userData };
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user_type');
    dispatch({ type: 'LOGOUT' });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'ADMIN' || localStorage.getItem('user_type') === 'admin';
  };

  // Get auth token
  const getToken = () => {
    return state.token || localStorage.getItem('auth_token');
  };

  const value = {
    ...state,
    login,
    logout,
    isAdmin,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};