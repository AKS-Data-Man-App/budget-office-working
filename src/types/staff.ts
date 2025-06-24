// src/types/staff.ts

// Staff status enumeration
export type StaffStatus = 
  | 'active'
  | 'on-leave'
  | 'due-for-promotion'
  | 'due-for-time-off'
  | 'returning-from-leave'
  | 'due-for-retirement'
  | 'retired'
  | 'resigned'
  | 'dismissed'
  | 'on-special-duty'
  | 'special-duty';

// Staff status badge configuration
export interface StaffStatusBadge {
  status: string;
  className: string;
  label: string;
}

// Staff member interface
export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  phoneNumber: string;
  department: string;
  position: string;
  grade: string;
  step: number;
  hireDate: string;
  dateOfBirth: string;
  dateOfEmployment: string;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  status: StaffStatus;
  leaveBalance: number;
  leaveStartDate?: string;
  leaveEndDate?: string;
  lastPromotionDate?: string;
  nextPromotionDue?: string;
  promotionDue?: boolean;
  timeOffDue?: boolean;
  retirementDate?: string;
  retirementDue?: boolean;
  salaryGrade: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  pensionId?: string;
  taxId?: string;
  profileImage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter types for staff filtering
export type FilterType = 
  | 'all'
  | 'due-for-promotion'
  | 'promotion-due'
  | 'due-for-time-off'
  | 'timeoff-due'
  | 'on-leave'
  | 'returning-from-leave'
  | 'returning-leave'
  | 'due-for-retirement'
  | 'retirement-due'
  | 'retired'
  | 'resigned'
  | 'dismissed'
  | 'on-special-duty'
  | 'special-duty';

// Application pages enumeration
export type Page = 'home' | 'budget-office' | 'database';

// User authentication interface
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin?: string;
  isActive: boolean;
  profileImage?: string;
}

// User roles
export type UserRole = 'admin' | 'manager' | 'officer' | 'viewer';

// Application context state interface
export interface AppState {
  currentPage: Page;
  selectedOffice: string;
  user: User | null;
  isAuthenticated: boolean;
  staffData: Staff[];
  filteredStaff: Staff[];
  currentFilter: FilterType;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

// Action types for state management
export type AppAction =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'SET_OFFICE'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_STAFF_DATA'; payload: Staff[] }
  | { type: 'SET_FILTERED_STAFF'; payload: Staff[] }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// Filter button configuration
export interface FilterButton {
  key: FilterType;
  label: string;
  icon?: string;
  color: 'orange' | 'green' | 'red' | 'blue' | 'yellow' | 'purple';
  count?: number;
}

// Export/Import data structure
export interface ExportData {
  staff: Staff[];
  exportDate: string;
  exportedBy: string;
  totalRecords: number;
  filters?: {
    filterType: FilterType;
    searchTerm?: string;
  };
}

// Statistics interface for dashboard
export interface StaffStats {
  total: number;
  active: number;
  onLeave: number;
  dueForPromotion: number;
  dueForRetirement: number;
  retired: number;
  byDepartment: Record<string, number>;
  byGrade: Record<string, number>;
}

// Form validation errors
export interface FormErrors {
  [key: string]: string;
}

// Sign in form data interface
export interface SignInFormData {
  username: string;
  password: string;
}

// API response structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}