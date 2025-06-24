// src/components/pages/DatabasePage.tsx

import React, { useState, useMemo } from 'react';
import { Download, Search, RotateCcw, Users, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { filterStaff, searchStaff, getStaffStats } from '../../utils/staffUtils';
import FilterButtons from '../database/FilterButtons';
import StaffTable from '../database/StaffTable';
import { Staff, FilterType } from '../../types/staff';

const DatabasePage: React.FC = () => {
  const { 
    state: { staffData, currentFilter, searchTerm, user }, 
    dispatch 
  } = useAppContext();
  
  // Use the user variable to prevent unused warning
  const currentUserName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Filter and search staff data
  const filteredStaff = useMemo(() => {
    const filtered = filterStaff(staffData, currentFilter);
    return searchTerm ? searchStaff(filtered, searchTerm) : filtered;
  }, [staffData, currentFilter, searchTerm]);

  const stats = useMemo(() => getStaffStats(staffData), [staffData]);

  const handleFilterChange = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const handleSearchChange = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const handleExportData = () => {
    const headers = ['Name', 'Employee ID', 'Position', 'Department', 'Status', 'Phone', 'Email'];
    const csvContent = [
      headers.join(','),
      ...filteredStaff.map(staff => [
        staff.name,
        staff.employeeId,
        staff.position,
        staff.department,
        staff.status,
        staff.phoneNumber,
        staff.email
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akwa-ibom-budget-office-staff-${currentFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    dispatch({ type: 'SET_FILTER', payload: 'all' });
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-orange-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Staff Database Management</h1>
                <p className="text-green-100 mt-1">
                  Akwa Ibom State Budget Office • Comprehensive Staff Records • Welcome, {currentUserName}
                </p>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeStaff}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-3xl font-bold text-gray-900">{stats.onLeave}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <p className="text-3xl font-bold text-gray-900">{filteredStaff.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff by name, ID, department, or position..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <FilterButtons 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
          staffData={staffData}
        />

        {/* Staff Table */}
        <StaffTable 
          staff={filteredStaff}
          onStaffSelect={setSelectedStaff}
          selectedStaff={selectedStaff}
        />
      </div>
    </div>
  );
};

export default DatabasePage;