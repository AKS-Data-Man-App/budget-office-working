// src/context/AppContext.tsx
// Real Backend Integration for Akwa Ibom State Budget Office
// Connects to working 3-tier authentication system

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  SignInFormData,
  AppState,
  AppAction,
  User,
  UserRole,
  AppPage,
  StaffRecord,
  NominalRollResponse
} from '../types/auth.types';
import apiService from '../services/api';

// ===================================================================
// CONTEXT TYPE DEFINITION
// ===================================================================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Authentication methods
  signIn: (credentials: SignInFormData) => Promise<boolean>;
  signOut: () => void;
  
  // Data loading methods
  loadNominalRoll: () => Promise<void>;
  loadAllUsers: () => Promise<void>;
  
  // User management methods
  createUser: (userData: { firstName: string; lastName: string; email: string; role: UserRole }) => Promise<boolean>;
  approveUser: (userId: string) => Promise<boolean>;
  
  // Utility methods
  checkAuthentication: () => Promise<void>;
  navigateToRoleDashboard: (role: UserRole) => void;
  
  // Legacy compatibility for existing frontend flow
  selectedOffice: string;
  setSelectedOffice: (office: string) => void;
  setCurrentPage: (page: AppPage | 'home' | 'budget-office' | 'database') => void;
  isSignedIn: boolean;
  currentUser: User | null;
}

// ===================================================================
// CONTEXT CREATION
// ===================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ===================================================================
// INITIAL STATE
// ===================================================================

const initialState: AppState = {
  // Authentication
  user: null,
  isAuthenticated: false,
  token: null,
  
  // Navigation
  currentPage: 'home',
  selectedOffice: '',
  
  // Data
  staffData: [],
  filteredStaff: [],
  allUsers: [],
  
  // UI State
  isLoading: false,
  error: null,
  
  // Filters & Search
  searchTerm: '',
  currentFilter: 'all'
};

// ===================================================================
// STATE REDUCER
// ===================================================================

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
        currentPage: getRoleDashboard(action.payload.user.role)
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        currentPage: 'home'
      };
    
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'SET_OFFICE':
      return { ...state, selectedOffice: action.payload };
    
    case 'SET_STAFF_DATA':
      return { 
        ...state, 
        staffData: action.payload,
        filteredStaff: action.payload 
      };
    
    case 'SET_FILTERED_STAFF':
      return { ...state, filteredStaff: action.payload };
    
    case 'SET_ALL_USERS':
      return { ...state, allUsers: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_FILTER':
      return { ...state, currentFilter: action.payload };
    
    default:
      return state;
  }
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Get dashboard page based on user role
 */
const getRoleDashboard = (role: UserRole): AppPage => {
  switch (role) {
    case 'ORGANIZATION_HEAD':
      return 'director-dashboard';
    case 'ICT_HEAD':
      return 'ict-dashboard';
    case 'STAFF':
      return 'staff-dashboard';
    default:
      return 'login';
  }
};

/**
 * Filter staff data based on search term and filter
 */
const filterStaffData = (staffData: StaffRecord[], searchTerm: string, filter: string): StaffRecord[] => {
  let filtered = staffData;
  
  // Apply search filter
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(staff => 
      staff.nameOfOfficer.toLowerCase().includes(searchLower) ||
      staff.rank.toLowerCase().includes(searchLower) ||
      staff.department.toLowerCase().includes(searchLower) ||
      staff.lga.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply status filter
  if (filter !== 'all') {
    filtered = filtered.filter(staff => {
      switch (filter) {
        case 'due-for-promotion':
          return staff.remarks.toLowerCase().includes('promotion');
        case 'due-for-retirement':
          return staff.remarks.toLowerCase().includes('retirement');
        case 'on-leave':
          return staff.remarks.toLowerCase().includes('leave');
        default:
          return true;
      }
    });
  }
  
  return filtered;
};

// ===================================================================
// CONTEXT PROVIDER
// ===================================================================

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ===================================================================
  // AUTHENTICATION METHODS
  // ===================================================================

  const signIn = async (credentials: SignInFormData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token
          }
        });
        
        // Load initial data after successful login
        await loadInitialData(response.data.user.role);
        
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Login failed' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  const signOut = () => {
    apiService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuthentication = async (): Promise<void> => {
    const token = apiService.getToken();
    
    if (!token) {
      // dispatch({ type: 'SET_PAGE', payload: 'login' });
      return;
    }

    try {
      const response = await apiService.getProfile();
      
      if (response.success && response.data) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data,
            token: token
          }
        });
        
        await loadInitialData(response.data.role);
      } else {
        // Invalid token, logout
        signOut();
      }
    } catch (error) {
      // Token expired or invalid, logout
      signOut();
    }
  };

  // ===================================================================
  // DATA LOADING METHODS
  // ===================================================================

  const loadInitialData = async (role: UserRole): Promise<void> => {
    try {
      // Load nominal roll for all roles
      await loadNominalRoll();
      
      // Load user data for admin roles
      if (role === 'ORGANIZATION_HEAD' || role === 'ICT_HEAD') {
        await loadAllUsers();
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadNominalRoll = async (): Promise<void> => {
    try {
      const response: NominalRollResponse = await apiService.getNominalRoll();
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_STAFF_DATA', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to load nominal roll:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load staff data' });
    }
  };

  const loadAllUsers = async (): Promise<void> => {
    try {
      const response = await apiService.getAllUsers();
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_ALL_USERS', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // ===================================================================
  // USER MANAGEMENT METHODS
  // ===================================================================

  const createUser = async (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    role: UserRole 
  }): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.createUser(userData);
      
      if (response.success) {
        // Reload users list
        await loadAllUsers();
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to create user' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.approveUser(userId);
      
      if (response.success) {
        // Reload users list
        await loadAllUsers();
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to approve user' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve user';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  const navigateToRoleDashboard = (role: UserRole): void => {
    const dashboardPage = getRoleDashboard(role);
    dispatch({ type: 'SET_PAGE', payload: dashboardPage });
  };

  // ===================================================================
  // EFFECTS
  // ===================================================================

  // Check authentication on app load
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Filter staff data when search term or filter changes
  useEffect(() => {
    const filtered = filterStaffData(state.staffData, state.searchTerm, state.currentFilter);
    dispatch({ type: 'SET_FILTERED_STAFF', payload: filtered });
  }, [state.staffData, state.searchTerm, state.currentFilter]);

  // ===================================================================
  // LEGACY COMPATIBILITY METHODS
  // ===================================================================

  const setSelectedOffice = (office: string): void => {
    dispatch({ type: 'SET_OFFICE', payload: office });
  };

  const setCurrentPage = (page: AppPage | 'home' | 'budget-office' | 'database'): void => {
    dispatch({ type: 'SET_PAGE', payload: page as AppPage });
  };

  // ===================================================================
  // CONTEXT VALUE
  // ===================================================================

  const contextValue: AppContextType = {
    state,
    dispatch,
    signIn,
    signOut,
    loadNominalRoll,
    loadAllUsers,
    createUser,
    approveUser,
    checkAuthentication,
    navigateToRoleDashboard,
    // Legacy compatibility
    selectedOffice: state.selectedOffice,
    setSelectedOffice,
    setCurrentPage,
    isSignedIn: state.isAuthenticated,
    currentUser: state.user
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// ===================================================================
// CONTEXT HOOK
// ===================================================================

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};