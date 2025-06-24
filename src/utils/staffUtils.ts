// src/utils/staffUtils.ts

import { Staff, FilterType, StaffStatusBadge, StaffStatus } from '../types/staff';

/**
 * Filter staff based on the selected filter type
 */
export const filterStaff = (staff: Staff[], filter: FilterType): Staff[] => {
  switch (filter) {
    case 'due-for-promotion':
    case 'promotion-due':
      return staff.filter(member => member.promotionDue || member.status === 'due-for-promotion');
      
    case 'due-for-time-off':
    case 'timeoff-due':
      return staff.filter(member => member.timeOffDue || member.status === 'due-for-time-off');
      
    case 'on-leave':
      return staff.filter(member => member.status === 'on-leave');
      
    case 'returning-from-leave':
    case 'returning-leave':
      return staff.filter(member => {
        if (member.status === 'on-leave' && member.leaveEndDate) {
          const returnDate = new Date(member.leaveEndDate);
          const today = new Date();
          const diffTime = returnDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && diffDays >= 0; // Returning within 7 days
        }
        return member.status === 'returning-from-leave';
      });
      
    case 'due-for-retirement':
    case 'retirement-due':
      return staff.filter(member => member.retirementDue || member.status === 'due-for-retirement');
      
    case 'retired':
      return staff.filter(member => member.status === 'retired');
      
    case 'resigned':
      return staff.filter(member => member.status === 'resigned');
      
    case 'dismissed':
      return staff.filter(member => member.status === 'dismissed');
      
    case 'on-special-duty':
    case 'special-duty':
      return staff.filter(member => member.status === 'on-special-duty' || member.status === 'special-duty');
      
    default:
      return staff;
  }
};

/**
 * Get count of staff for a specific filter
 */
export const getFilterCount = (staff: Staff[], filter: FilterType): number => {
  return filterStaff(staff, filter).length;
};

/**
 * Get status badge configuration for display
 */
export const getStatusBadge = (status: StaffStatus): StaffStatusBadge => {
  const statusConfig: Record<StaffStatus, StaffStatusBadge> = {
    active: {
      status: 'active',
      className: 'bg-green-100 text-green-800',
      label: 'Active'
    },
    'on-leave': {
      status: 'on-leave',
      className: 'bg-yellow-100 text-yellow-800',
      label: 'On Leave'
    },
    'due-for-promotion': {
      status: 'due-for-promotion',
      className: 'bg-blue-100 text-blue-800',
      label: 'Promotion Due'
    },
    'due-for-time-off': {
      status: 'due-for-time-off',
      className: 'bg-purple-100 text-purple-800',
      label: 'Time Off Due'
    },
    'returning-from-leave': {
      status: 'returning-from-leave',
      className: 'bg-indigo-100 text-indigo-800',
      label: 'Returning Soon'
    },
    'due-for-retirement': {
      status: 'due-for-retirement',
      className: 'bg-orange-100 text-orange-800',
      label: 'Retirement Due'
    },
    retired: {
      status: 'retired',
      className: 'bg-gray-100 text-gray-800',
      label: 'Retired'
    },
    resigned: {
      status: 'resigned',
      className: 'bg-red-100 text-red-800',
      label: 'Resigned'
    },
    dismissed: {
      status: 'dismissed',
      className: 'bg-red-100 text-red-800',
      label: 'Dismissed'
    },
    'on-special-duty': {
      status: 'on-special-duty',
      className: 'bg-blue-100 text-blue-800',
      label: 'Special Duty'
    },
    'special-duty': {
      status: 'special-duty',
      className: 'bg-blue-100 text-blue-800',
      label: 'Special Duty'
    }
  };
  
  return statusConfig[status] || statusConfig.active;
};

/**
 * Calculate years of service based on employment date
 */
export const calculateYearsOfService = (dateOfEmployment: string): number => {
  const employmentDate = new Date(dateOfEmployment);
  const today = new Date();
  const diffTime = today.getTime() - employmentDate.getTime();
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diffYears);
};

/**
 * Check if staff member is eligible for retirement
 */
export const checkRetirementEligibility = (staff: Staff): boolean => {
  const yearsOfService = calculateYearsOfService(staff.dateOfEmployment);
  return yearsOfService >= 35; // Simplified check based on years of service
};

/**
 * Get days until leave ends
 */
export const getDaysUntilLeaveEnds = (leaveEndDate: string): number => {
  const endDate = new Date(leaveEndDate);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Check if staff member is returning from leave soon
 */
export const isReturningFromLeaveSoon = (staff: Staff): boolean => {
  if (staff.status === 'on-leave' && staff.leaveEndDate) {
    const daysUntilReturn = getDaysUntilLeaveEnds(staff.leaveEndDate);
    return daysUntilReturn <= 7 && daysUntilReturn >= 0;
  }
  return false;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Nigerian phone numbers
  if (cleaned.startsWith('234')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Get staff member initials from name
 */
export const getStaffInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Search staff members by various criteria
 */
export const searchStaff = (staff: Staff[], searchTerm: string): Staff[] => {
  if (!searchTerm.trim()) return staff;
  
  const term = searchTerm.toLowerCase();
  return staff.filter(member =>
    member.name.toLowerCase().includes(term) ||
    member.employeeId.toLowerCase().includes(term) ||
    member.department.toLowerCase().includes(term) ||
    member.position.toLowerCase().includes(term)
  );
};

/**
 * Sort staff members by different criteria
 */
export const sortStaff = (staff: Staff[], sortBy: 'name' | 'date' | 'department'): Staff[] => {
  return [...staff].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(a.dateOfEmployment).getTime() - new Date(b.dateOfEmployment).getTime();
      case 'department':
        return a.department.localeCompare(b.department);
      default:
        return 0;
    }
  });
};

/**
 * Get staff statistics
 */
export const getStaffStats = (staff: Staff[]) => {
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const onLeave = staff.filter(s => s.status === 'on-leave').length;
  const promotionDue = staff.filter(s => s.promotionDue || s.status === 'due-for-promotion').length;
  const retirementDue = staff.filter(s => s.retirementDue || s.status === 'due-for-retirement').length;
  
  return {
    totalStaff,
    activeStaff,
    onLeave,
    promotionDue,
    retirementDue
  };
};

/**
 * Export staff data to CSV format
 */
export const exportToCSV = (staff: Staff[], filename: string = 'staff-data'): void => {
  const headers = [
    'Name', 'Employee ID', 'Position', 'Department', 'Status', 
    'Phone', 'Email', 'Date of Employment', 'Years of Service'
  ];
  
  const csvContent = [
    headers.join(','),
    ...staff.map(member => [
      `"${member.name}"`,
      member.employeeId,
      `"${member.position}"`,
      `"${member.department}"`,
      member.status,
      member.phoneNumber,
      member.email,
      member.dateOfEmployment,
      calculateYearsOfService(member.dateOfEmployment)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};