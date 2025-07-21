// src/components/pages/StaffDashboard.tsx  
// Staff Dashboard - Simple Read-Only Access

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileText, Users, Search } from 'lucide-react';

const StaffDashboard: React.FC = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter staff based on search
  const filteredStaff = state.staffData.filter(staff =>
    staff.nameOfOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-600">View Staff Directory & Information</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {state.user?.firstName?.[0]}{state.user?.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome, {state.user?.firstName} {state.user?.lastName}
              </h2>
              <p className="text-gray-600">{state.user?.office} - Staff Member</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Staff Records</p>
                <p className="text-2xl font-bold">{state.staffData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold">
                  {new Set(state.staffData.map(s => s.department)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Directory */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Staff Directory</h3>
              
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">S/N</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">LGA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff, index) => (
                    <tr key={staff.sn} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 text-sm">{staff.sn}</td>
                      <td className="py-3 px-4 text-sm font-medium">{staff.nameOfOfficer}</td>
                      <td className="py-3 px-4 text-sm">{staff.rank}</td>
                      <td className="py-3 px-4 text-sm">{staff.gradeLevel}</td>
                      <td className="py-3 px-4 text-sm">{staff.department}</td>
                      <td className="py-3 px-4 text-sm">{staff.lga}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No staff found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Staff Portal Access:</strong> You have read-only access to view staff directory and contact information. 
                For data updates or administrative tasks, please contact your ICT Administrator or Director.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;