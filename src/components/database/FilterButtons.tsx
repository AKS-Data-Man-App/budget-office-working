// src/components/database/FilterButtons.tsx

import React from 'react';
import { 
  Users, Award, Calendar, UserCheck, Clock, UserX, 
  Briefcase, RotateCcw, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { FilterType, Staff } from '../../types/auth.types';
import { getFilterCount } from '../../utils/staffUtils';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  staffData: Staff[];
}

interface FilterOption {
  key: FilterType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: 'gray' | 'blue' | 'purple' | 'yellow' | 'green' | 'orange' | 'red';
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
  staffData
}) => {
  const filterOptions: FilterOption[] = [
    {
      key: 'all',
      label: 'All Staff',
      icon: <Users className="w-4 h-4" />,
      description: 'View all staff members',
      color: 'gray'
    },
    {
      key: 'due-for-promotion',
      label: 'Promotion Due',
      icon: <Award className="w-4 h-4" />,
      description: 'Staff members eligible for promotion',
      color: 'blue'
    },
    {
      key: 'due-for-time-off',
      label: 'Time Off Due',
      icon: <Calendar className="w-4 h-4" />,
      description: 'Staff members due for time off',
      color: 'purple'
    },
    {
      key: 'on-leave',
      label: 'On Leave',
      icon: <UserCheck className="w-4 h-4" />,
      description: 'Staff members currently on leave',
      color: 'yellow'
    },
    {
      key: 'returning-from-leave',
      label: 'Returning Soon',
      icon: <UserCheck className="w-4 h-4" />,
      description: 'Staff returning from leave within 7 days',
      color: 'green'
    },
    {
      key: 'due-for-retirement',
      label: 'Retirement Due',
      icon: <Clock className="w-4 h-4" />,
      description: 'Staff members due for retirement',
      color: 'orange'
    },
    {
      key: 'retired',
      label: 'Retired',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Staff members who have retired',
      color: 'gray'
    },
    {
      key: 'resigned',
      label: 'Resigned',
      icon: <UserX className="w-4 h-4" />,
      description: 'Staff members who have resigned',
      color: 'red'
    },
    {
      key: 'dismissed',
      label: 'Dismissed',
      icon: <AlertTriangle className="w-4 h-4" />,
      description: 'Staff members dismissed from service',
      color: 'red'
    },
    {
      key: 'on-special-duty',
      label: 'Special Duty',
      icon: <Briefcase className="w-4 h-4" />,
      description: 'Staff members on special duty assignment',
      color: 'blue'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean): string => {
    const colorMap: Record<string, { active: string; inactive: string }> = {
      gray: {
        active: 'bg-gray-600 text-white shadow-lg',
        inactive: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
      },
      blue: {
        active: 'bg-blue-600 text-white shadow-lg',
        inactive: 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'
      },
      purple: {
        active: 'bg-purple-600 text-white shadow-lg',
        inactive: 'bg-white text-purple-700 hover:bg-purple-50 border-purple-200'
      },
      yellow: {
        active: 'bg-yellow-600 text-white shadow-lg',
        inactive: 'bg-white text-yellow-700 hover:bg-yellow-50 border-yellow-200'
      },
      green: {
        active: 'bg-green-600 text-white shadow-lg',
        inactive: 'bg-white text-green-700 hover:bg-green-50 border-green-200'
      },
      orange: {
        active: 'bg-orange-600 text-white shadow-lg',
        inactive: 'bg-white text-orange-700 hover:bg-orange-50 border-orange-200'
      },
      red: {
        active: 'bg-red-600 text-white shadow-lg',
        inactive: 'bg-white text-red-700 hover:bg-red-50 border-red-200'
      }
    };

    const colorConfig = colorMap[color] || colorMap.gray;
    return isActive ? colorConfig.active : colorConfig.inactive;
  };

  // Check if current filter is 'all' by comparing with the specific value
  const isShowingAllStaff = currentFilter === ('all' as FilterType);
  
  // Get the count for current filter
  const currentCount = getFilterCount(staffData, currentFilter);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Users className="w-5 h-5 mr-2 text-green-600" />
          Filter Staff Categories
        </h3>
        <div className="text-sm text-gray-500">
          {currentCount} staff members
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {filterOptions.map((option) => {
          const isActive = currentFilter === option.key;
          const count = getFilterCount(staffData, option.key);
          
          return (
            <button
              key={option.key}
              onClick={() => onFilterChange(option.key)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${getColorClasses(option.color, isActive)}
              `}
              title={option.description}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center">
                  {option.icon}
                </div>
                <div className="text-sm font-medium">
                  {option.label}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </div>
              </div>
              
              {/* Alert indicator for important filters */}
              {(option.key === 'due-for-promotion' || option.key === 'due-for-retirement' || option.key === 'returning-from-leave') && count > 0 && !isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('due-for-promotion')}
          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          🏆 Quick: Promotions ({getFilterCount(staffData, 'due-for-promotion')})
        </button>
        <button
          onClick={() => onFilterChange('due-for-retirement')}
          className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
        >
          ⏰ Quick: Retirements ({getFilterCount(staffData, 'due-for-retirement')})
        </button>
        <button
          onClick={() => onFilterChange('returning-from-leave')}
          className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
        >
          🔄 Quick: Returning ({getFilterCount(staffData, 'returning-from-leave')})
        </button>
        <button
          onClick={() => onFilterChange('all')}
          className="text-xs px-3 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          📊 View All ({getFilterCount(staffData, 'all')})
        </button>
      </div>

      {/* Filter Summary - Only show when not displaying all staff */}
      {!isShowingAllStaff && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Showing {currentCount} staff members 
                {(() => {
                  const activeOption = filterOptions.find(f => f.key === currentFilter);
                  return activeOption ? ` • Filter: ${activeOption.label}` : '';
                })()}
              </span>
            </div>
            <button
              onClick={() => onFilterChange('all')}
              className="text-green-600 hover:text-green-800 transition-colors"
              title="Clear filter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButtons;