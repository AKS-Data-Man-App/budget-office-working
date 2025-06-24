// src/context/AppContext.tsx

// src/context/AppContext.tsx

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SignInFormData, AppState, AppAction, User } from '../types/staff';
import { sampleStaff } from '../data/sampleData';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  signIn: (credentials: SignInFormData) => Promise<boolean>;
  signOut: () => void;
  // Legacy properties for backward compatibility
  selectedOffice: string;
  setSelectedOffice: (office: string) => void;
  setCurrentPage: (page: 'home' | 'budget-office' | 'database') => void;
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  signInForm: SignInFormData;
  setSignInForm: (form: SignInFormData) => void;
  handleSignOut: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  currentPage: 'home',
  selectedOffice: '',
  user: null,
  isAuthenticated: false,
  staffData: sampleStaff,
  filteredStaff: sampleStaff,
  currentFilter: 'all',
  searchTerm: '',
  isLoading: false,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'SET_OFFICE':
      return { ...state, selectedOffice: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_STAFF_DATA':
      return { ...state, staffData: action.payload };
    
    case 'SET_FILTERED_STAFF':
      return { ...state, filteredStaff: action.payload };
    
    case 'SET_FILTER':
      return { ...state, currentFilter: action.payload };
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentPage: 'home',
        selectedOffice: '',
        currentFilter: 'all',
        searchTerm: '',
        error: null
      };
    
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const signIn = async (credentials: SignInFormData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - in real app, this would be an API call
      const mockUsers = [
        {
          id: '1',
          username: 'admin',
          password: 'password123',
          firstName: 'System',
          lastName: 'Administrator',
          email: 'admin@aksgov.ng',
          role: 'admin' as const,
          department: 'IT',
          isActive: true
        },
        {
          id: '2',
          username: 'budget.officer',
          password: 'budget2024',
          firstName: 'Budget',
          lastName: 'Officer',
          email: 'budget@aksgov.ng',
          role: 'manager' as const,
          department: 'Budget Office',
          isActive: true
        }
      ];

      const user = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        const authenticatedUser: User = {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive,
          lastLogin: new Date().toISOString()
        };

        dispatch({ type: 'SET_USER', payload: authenticatedUser });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        dispatch({ type: 'SET_PAGE', payload: 'database' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid username or password' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred during sign in' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const signOut = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleSignOut = () => {
    signOut();
  };

  const setSelectedOffice = (office: string) => {
    dispatch({ type: 'SET_OFFICE', payload: office });
  };

  const setCurrentPage = (page: 'home' | 'budget-office' | 'database') => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const setIsSignedIn = (value: boolean) => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: value });
  };

  const setCurrentUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setSignInForm = (form: SignInFormData) => {
    // This is handled locally in the component, but we provide it for compatibility
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    signIn,
    signOut,
    // Legacy properties with proper functions
    selectedOffice: state.selectedOffice,
    setSelectedOffice,
    setCurrentPage,
    isSignedIn: state.isAuthenticated,
    setIsSignedIn,
    currentUser: state.user,
    setCurrentUser,
    signInForm: { username: '', password: '' },
    setSignInForm,
    handleSignOut
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};