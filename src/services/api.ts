// src/services/api.ts
// API Service for Akwa Ibom State Budget Office Backend Integration
// Connects to: https://budget-office-backend.onrender.com

import {
  LoginResponse,
  SignInFormData,
  NominalRollResponse,
  UserManagementResponse,
  UsersListResponse,
  CreateUserRequest,
  User,
  ApiResponse,
  ApiError
} from '../types/auth.types';

// ===================================================================
// API CONFIGURATION
// ===================================================================

const API_BASE_URL = 'https://budget-office-backend.onrender.com/api/v1';

// API endpoints
const ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
  
  // User Management
  USERS: '/users',
  USERS_BOOTSTRAP: '/users/bootstrap',
  USERS_PENDING: '/users/pending',
  USER_APPROVE: (userId: string) => `/users/${userId}/approve`,
  USER_DEACTIVATE: (userId: string) => `/users/${userId}/deactivate`,
  
  // Staff Data
  NOMINAL_ROLL: '/nominal-roll',
  STAFF: '/staff',
  
  // Departments
  DEPARTMENTS: '/departments'
} as const;

// ===================================================================
// HTTP CLIENT CLASS
// ===================================================================

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  // ===================================================================
  // TOKEN MANAGEMENT
  // ===================================================================

  /**
   * Set JWT token for authenticated requests
   */
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Get current JWT token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Remove JWT token (logout)
   */
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Load token from localStorage on app start
   */
  private loadTokenFromStorage(): void {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      this.token = savedToken;
    }
  }

  // ===================================================================
  // HTTP REQUEST METHODS
  // ===================================================================

  /**
   * Make HTTP request with proper error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Parse JSON response
      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle API errors (success: false)
      if (data.success === false) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      
      // Re-throw with proper error format
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Network request failed');
    }
  }

  /**
   * GET request
   */
  private async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  private async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  private async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  private async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // ===================================================================
  // AUTHENTICATION API METHODS
  // ===================================================================

  /**
   * Login user with username/password
   * Matches: POST /api/v1/auth/login
   */
  async login(credentials: SignInFormData): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
    
    // Automatically set token on successful login
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Get current user profile
   * Matches: GET /api/v1/auth/profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>(ENDPOINTS.PROFILE);
  }

  /**
   * Logout user (clear token)
   */
  logout(): void {
    this.clearToken();
  }

  // ===================================================================
  // USER MANAGEMENT API METHODS
  // ===================================================================

  /**
   * Create new user (admin only)
   * Matches: POST /api/v1/users
   */
  async createUser(userData: CreateUserRequest): Promise<UserManagementResponse> {
    return this.post<UserManagementResponse>(ENDPOINTS.USERS, userData);
  }

  /**
   * Get all users (admin only)
   * Matches: GET /api/v1/users
   */
  async getAllUsers(): Promise<UsersListResponse> {
    return this.get<UsersListResponse>(ENDPOINTS.USERS);
  }

  /**
   * Get pending user approvals (director only)
   * Matches: GET /api/v1/users/pending
   */
  async getPendingApprovals(): Promise<UsersListResponse> {
    return this.get<UsersListResponse>(ENDPOINTS.USERS_PENDING);
  }

  /**
   * Approve user account (director only)
   * Matches: POST /api/v1/users/:userId/approve
   */
  async approveUser(userId: string): Promise<UserManagementResponse> {
    return this.post<UserManagementResponse>(ENDPOINTS.USER_APPROVE(userId));
  }

  /**
   * Deactivate user account (admin only)
   * Matches: POST /api/v1/users/:userId/deactivate
   */
  async deactivateUser(userId: string): Promise<UserManagementResponse> {
    return this.post<UserManagementResponse>(ENDPOINTS.USER_DEACTIVATE(userId));
  }

  /**
   * Bootstrap initial director account (setup only)
   * Matches: POST /api/v1/users/bootstrap
   */
  async bootstrap(directorData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<UserManagementResponse> {
    return this.post<UserManagementResponse>(ENDPOINTS.USERS_BOOTSTRAP, directorData);
  }

  // ===================================================================
  // STAFF DATA API METHODS
  // ===================================================================

  /**
   * Get staff nominal roll (government 14-column format)
   * Matches: GET /api/v1/nominal-roll
   */
  async getNominalRoll(): Promise<NominalRollResponse> {
    return this.get<NominalRollResponse>(ENDPOINTS.NOMINAL_ROLL);
  }

  /**
   * Get all staff data
   * Matches: GET /api/v1/staff
   */
  async getAllStaff(): Promise<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(ENDPOINTS.STAFF);
  }

  // ===================================================================
  // DEPARTMENT API METHODS
  // ===================================================================

  /**
   * Get all departments
   * Matches: GET /api/v1/departments
   */
  async getDepartments(): Promise<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(ENDPOINTS.DEPARTMENTS);
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /**
   * Get API base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Health check - test backend connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ===================================================================
// SINGLETON INSTANCE
// ===================================================================

// Create singleton instance
const apiService = new ApiService();

// Export singleton instance
export default apiService;

// Export class for testing/custom instances
export { ApiService };

// ===================================================================
// CONVENIENCE EXPORTS
// ===================================================================

// Export common methods for easy importing
export const {
  login,
  logout,
  getProfile,
  createUser,
  getAllUsers,
  getPendingApprovals,
  approveUser,
  deactivateUser,
  getNominalRoll,
  getAllStaff,
  getDepartments,
  isAuthenticated,
  setToken,
  getToken,
  clearToken
} = apiService;