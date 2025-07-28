import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SignInFormData, AppState, AppAction, User, UserRole, AppPage, StaffRecord, NominalRollResponse } from '../types/auth.types';
import apiService from '../services/api';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  signIn: (credentials: SignInFormData) => Promise<boolean>;
  signOut: () => void;
  loadNominalRoll: () => Promise<void>;
  loadAllUsers: () => Promise<void>;
  createUser: (userData: { firstName: string; lastName: string; email: string; role: UserRole }) => Promise<boolean>;
  approveUser: (userId: string) => Promise<boolean>;
  checkAuthentication: () => Promise<void>;
  navigateToRoleDashboard: (role: UserRole) => void;
  selectedOffice: string;
  setSelectedOffice: (office: string) => void;
  setCurrentPage: (page: AppPage | 'home' | 'budget-office' | 'database') => void;
  isSignedIn: boolean;
  currentUser: User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: null, isAuthenticated: false, token: null, currentPage: 'home', selectedOffice: '',
  staffData: [], filteredStaff: [], allUsers: [], isLoading: false, error: null, searchTerm: '', currentFilter: 'all'
};

const getRoleDashboard = (role: UserRole): AppPage => {
  const dashboards: Record<UserRole, AppPage> = { 'ORGANIZATION_HEAD': 'director-dashboard', 'ICT_HEAD': 'ict-dashboard', 'STAFF': 'staff-dashboard' };
  return dashboards[role] || 'login';
};

const filterStaffData = (staffData: StaffRecord[], searchTerm: string, filter: string): StaffRecord[] => {
  let filtered = staffData;
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(staff => 
      staff.nameOfOfficer.toLowerCase().includes(searchLower) ||
      staff.rank.toLowerCase().includes(searchLower) ||
      staff.department.toLowerCase().includes(searchLower) ||
      staff.lga.toLowerCase().includes(searchLower)
    );
  }
  if (filter !== 'all') {
    const filterMap: Record<string, string> = { 'due-for-promotion': 'promotion', 'due-for-retirement': 'retirement', 'on-leave': 'leave' };
    filtered = filtered.filter(staff => staff.remarks.toLowerCase().includes(filterMap[filter] || ''));
  }
  return filtered;
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, error: null, currentPage: getRoleDashboard(action.payload.user.role) };
    case 'LOGOUT':
      return { ...initialState, currentPage: 'home' };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_OFFICE':
      return { ...state, selectedOffice: action.payload };
    case 'SET_STAFF_DATA':
      return { ...state, staffData: action.payload, filteredStaff: action.payload };
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const signIn = async (credentials: SignInFormData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data.user, token: response.data.token } });
        await loadInitialData(response.data.user.role);
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    apiService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuthentication = async (): Promise<void> => {
    const token = apiService.getToken();
    if (!token) return;
    try {
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data, token: token } });
        await loadInitialData(response.data.role);
      } else {
        signOut();
      }
    } catch (error) {
      signOut();
    }
  };

  const loadInitialData = async (role: UserRole): Promise<void> => {
    try {
      await loadNominalRoll();
      if (role === 'ORGANIZATION_HEAD' || role === 'ICT_HEAD') await loadAllUsers();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadNominalRoll = async (): Promise<void> => {
    try {
      const response: NominalRollResponse = await apiService.getNominalRoll();
      if (response.success && response.data) dispatch({ type: 'SET_STAFF_DATA', payload: response.data });
    } catch (error) {
      console.error('Failed to load nominal roll:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load staff data' });
    }
  };

  const loadAllUsers = async (): Promise<void> => {
    try {
      const response = await apiService.getAllUsers();
      if (response.success && response.data) dispatch({ type: 'SET_ALL_USERS', payload: response.data });
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const createUser = async (userData: { firstName: string; lastName: string; email: string; role: UserRole }): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await apiService.createUser(userData);
      if (response.success) {
        await loadAllUsers();
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to create user' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create user' });
      return false;
    }
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await apiService.approveUser(userId);
      if (response.success) {
        await loadAllUsers();
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to approve user' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to approve user' });
      return false;
    }
  };

  const navigateToRoleDashboard = (role: UserRole): void => {
    dispatch({ type: 'SET_PAGE', payload: getRoleDashboard(role) });
  };

  const setSelectedOffice = (office: string): void => {
    dispatch({ type: 'SET_OFFICE', payload: office });
  };

  const setCurrentPage = (page: AppPage | 'home' | 'budget-office' | 'database'): void => {
    dispatch({ type: 'SET_PAGE', payload: page as AppPage });
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    const filtered = filterStaffData(state.staffData, state.searchTerm, state.currentFilter);
    dispatch({ type: 'SET_FILTERED_STAFF', payload: filtered });
  }, [state.staffData, state.searchTerm, state.currentFilter]);

  const contextValue: AppContextType = {
    state, dispatch, signIn, signOut, loadNominalRoll, loadAllUsers, createUser, approveUser, 
    checkAuthentication, navigateToRoleDashboard, selectedOffice: state.selectedOffice, 
    setSelectedOffice, setCurrentPage, isSignedIn: state.isAuthenticated, currentUser: state.user
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};