// src/types/auth.types.ts
// Backend-Aligned Types for Akwa Ibom State Budget Office
// Matches exact backend structure from Prisma schema and API responses

// ===================================================================
// AUTHENTICATION TYPES (3-Tier Government System)
// ===================================================================

// User roles matching backend UserRole enum
export type UserRole = 
  | 'ORGANIZATION_HEAD'  // Director level
  | 'ICT_HEAD'          // ICT Administrator level  
  | 'STAFF';            // Regular staff level

// User status matching backend UserStatus enum
export type UserStatus = 
  | 'PENDING_APPROVAL'
  | 'APPROVED_PENDING_ACTIVATION'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED';

// Staff status matching backend StaffStatus enum
export type StaffStatus = 
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'RETIRED'
  | 'RESIGNED'
  | 'DISMISSED'
  | 'SPECIAL_DUTY'
  | 'SUSPENDED'
  | 'DECEASED';

// ===================================================================
// USER TYPES (Matching Backend Response)
// ===================================================================

// User object from backend login response
export interface User {
  id: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  office: string;
  state: string;
  email?: string;
  departmentId?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// Login credentials
export interface SignInFormData {
  username: string;
  password: string;
}

// Login response from backend
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// ===================================================================
// STAFF TYPES (Government Nominal Roll - 14 Columns)
// ===================================================================

// Staff record matching backend nominal roll response
export interface StaffRecord {
  sn: number;                          // Column 1: S/N
  nameOfOfficer: string;               // Column 2: NAME OF OFFICER
  sex: 'Male' | 'Female';              // Column 3: SEX
  dateOfBirth: string;                 // Column 4: DATE OF BIRTH
  dateOfFirstAppointment: string;      // Column 5: DATE OF 1ST APPT
  dateOfConfirmation: string;          // Column 6: DATE OF CONFIRMATION
  dateOfLastPromotion: string;         // Column 7: DATE OF LAST PROM
  rank: string;                        // Column 8: RANK
  gradeLevel: string;                  // Column 9: G L (Grade Level)
  step: number;                        // Column 10: STEP
  educationalQualification: string;    // Column 11: EDUCATIONAL QUALIFICATION
  lga: string;                         // Column 12: LGA
  dateOfRetirement: string;            // Column 13: DATE OF RETIREMENT
  remarks: string;                     // Column 14: REMARKS
  department: string;                  // Additional: Department
}

// Nominal roll response from backend
export interface NominalRollResponse {
  success: boolean;
  title: string;
  state: string;
  office: string;
  totalStaff: number;
  data: StaffRecord[];
}

// Full staff model (for detailed views)
export interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string;
  serialNumber?: string;
  sex: 'Male' | 'Female';
  dateOfBirth?: string;
  dateOfFirstAppointment?: string;
  dateOfConfirmation?: string;
  dateOfLastPromotion?: string;
  rank: string;
  gradeLevel?: string;
  step?: number;
  educationalQualification?: string;
  lga?: string;
  dateOfRetirement?: string;
  remarks?: string;
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
  maritalStatus?: string;
  nationality: string;
  stateOfOrigin?: string;
  departmentId: string;
  employmentType: string;
  status: StaffStatus;
  residentialAddress?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  promotionDue: boolean;
  timeOffDue: boolean;
  retirementDue: boolean;
  nextPromotionDate?: string;
  profilePhoto?: string;
  biography?: string;
  skills: string[];
  certifications: string[];
  currentLeaveType?: string;
  leaveStartDate?: string;
  leaveEndDate?: string;
  leaveReason?: string;
  leaveDaysUsed: number;
  leaveDaysBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

// ===================================================================
// USER MANAGEMENT TYPES (3-Tier System)
// ===================================================================

// Create user request
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  departmentId?: string;
}

// User management response
export interface UserManagementResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    tempPassword?: string;
  };
}

// Users list response
export interface UsersListResponse {
  success: boolean;
  data: User[];
  total: number;
}

// ===================================================================
// APPLICATION STATE TYPES
// ===================================================================

// Application pages for role-based routing
export type AppPage = 
  | 'home'
  | 'budget-office' 
  | 'database'
  | 'login'
  | 'director-dashboard'
  | 'ict-dashboard' 
  | 'staff-dashboard';

// Application state
export interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Navigation
  currentPage: AppPage;
  selectedOffice: string;
  
  // Data
  staffData: StaffRecord[];
  filteredStaff: StaffRecord[];
  allUsers: User[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Filters & Search
  searchTerm: string;
  currentFilter: string;
}

// Action types for state management
export type AppAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_PAGE'; payload: AppPage }
  | { type: 'SET_OFFICE'; payload: string }
  | { type: 'SET_STAFF_DATA'; payload: StaffRecord[] }
  | { type: 'SET_FILTERED_STAFF'; payload: StaffRecord[] }
  | { type: 'SET_ALL_USERS'; payload: User[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER'; payload: string };

// ===================================================================
// API RESPONSE TYPES
// ===================================================================

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// API Error response
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  timestamp?: string;
}

// ===================================================================
// PERMISSION TYPES
// ===================================================================

// Role permissions mapping
export interface RolePermissions {
  canCreateUsers: boolean;
  canApproveUsers: boolean;
  canManageStaff: boolean;
  canAccessDatabase: boolean;
  canExportData: boolean;
  canViewReports: boolean;
  canManageDepartments: boolean;
}

// Permission check function type
export type PermissionCheck = (userRole: UserRole) => RolePermissions;