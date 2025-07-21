// src/components/database/StaffTable.tsx

import React, { useState } from 'react';
import { 
  Eye, Phone, Mail, Award, Calendar, Clock, 
  X, User, MapPin, Briefcase, FileText 
} from 'lucide-react';
import { Staff } from '../../types/auth.types';
import { 
  getStatusBadge, 
  calculateYearsOfService, 
  formatPhoneNumber, 
  getStaffInitials,
  getDaysUntilLeaveEnds 
} from '../../utils/staffUtils';

interface StaffTableProps {
  staff: Staff[];
  onStaffSelect: (staff: Staff | null) => void;
  selectedStaff: Staff | null;
}

const StaffTable: React.FC<StaffTableProps> = ({ 
  staff, 
  onStaffSelect, 
  selectedStaff 
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'department' | 'date') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedStaff = [...staff].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'department':
        comparison = a.department.localeCompare(b.department);
        break;
      case 'date':
        comparison = new Date(a.dateOfEmployment).getTime() - new Date(b.dateOfEmployment).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Members Found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters to find staff members.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-green-50 to-orange-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Staff Member
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center">
                    Department & Position
                    {sortBy === 'department' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Alerts
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Service Details
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStaff.map((staffMember) => {
                const statusBadge = getStatusBadge(staffMember.status as any);
                const yearsOfService = calculateYearsOfService(staffMember.dateOfEmployment);
                
                return (
                  <tr key={staffMember.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-medium text-sm">
                            {getStaffInitials(staffMember.name)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {staffMember.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {staffMember.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{staffMember.position}</div>
                        <div className="text-gray-500">{staffMember.department}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Grade: {staffMember.grade} • Step: {staffMember.step}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Employed: {new Date(staffMember.dateOfEmployment).toLocaleDateString()}
                        </div>
                        {staffMember.status === 'on-leave' && staffMember.leaveEndDate && (
                          <div className="text-xs text-orange-600 mt-1">
                            Returns in {getDaysUntilLeaveEnds(staffMember.leaveEndDate)} days
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {formatPhoneNumber(staffMember.phoneNumber)}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {staffMember.email}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {staffMember.promotionDue && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <Award className="w-3 h-3 mr-1" />
                            Promotion Due
                          </span>
                        )}
                        {staffMember.timeOffDue && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            <Calendar className="w-3 h-3 mr-1" />
                            Time Off Due
                          </span>
                        )}
                        {staffMember.retirementDue && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Retirement Due
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {yearsOfService} years of service
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onStaffSelect(staffMember)}
                        className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{staff.length}</span> staff members
            </div>
            <div className="text-sm text-gray-500">
              Click on "View" to see detailed information
            </div>
          </div>
        </div>
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-orange-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {getStaffInitials(selectedStaff.name)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{selectedStaff.name}</h4>
                    <p className="text-green-100">{selectedStaff.position}</p>
                  </div>
                </div>
                <button
                  onClick={() => onStaffSelect(null)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-green-600" />
                      Personal Information
                    </h5>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee ID</label>
                        <p className="text-gray-800">{selectedStaff.employeeId}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <p className="text-gray-800">{new Date(selectedStaff.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gender</label>
                        <p className="text-gray-800">{selectedStaff.gender}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Marital Status</label>
                        <p className="text-gray-800">{selectedStaff.maritalStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                      Employment Details
                    </h5>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-gray-800">{selectedStaff.department}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Employment</label>
                        <p className="text-gray-800">{new Date(selectedStaff.dateOfEmployment).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Years of Service</label>
                        <p className="text-gray-800">{calculateYearsOfService(selectedStaff.dateOfEmployment)} years</p>
                      </div>
                      
                      {selectedStaff.status === 'on-leave' && selectedStaff.leaveStartDate && selectedStaff.leaveEndDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Leave Period</label>
                          <p className="text-gray-800">
                            {new Date(selectedStaff.leaveStartDate).toLocaleDateString()} - {new Date(selectedStaff.leaveEndDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-orange-600">
                            Returns in {getDaysUntilLeaveEnds(selectedStaff.leaveEndDate)} days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Status Information */}
                <div className="space-y-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-600" />
                      Contact Information
                    </h5>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-gray-800 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {formatPhoneNumber(selectedStaff.phoneNumber)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-gray-800 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedStaff.email}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-800 flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          {selectedStaff.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status & Alerts */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      Status & Alerts
                    </h5>
                    
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-500">Current Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedStaff.status as any).className}`}>
                          {getStatusBadge(selectedStaff.status as any).label}
                        </span>
                      </div>
                    </div>
                  
                    <div className="space-y-2">
                      {selectedStaff.promotionDue && (
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Award className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Promotion Due</p>
                            <p className="text-xs text-blue-600">Staff member is eligible for promotion</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedStaff.timeOffDue && (
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-yellow-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Time Off Due</p>
                            <p className="text-xs text-yellow-600">Staff member is due for time off</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedStaff.retirementDue && (
                        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                          <Clock className="w-5 h-5 text-purple-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-purple-800">Retirement Due</p>
                            <p className="text-xs text-purple-600">Staff member is eligible for retirement</p>
                          </div>
                        </div>
                      )}
                      
                      {!selectedStaff.promotionDue && !selectedStaff.timeOffDue && !selectedStaff.retirementDue && (
                        <div className="text-gray-500 text-sm italic">
                          No active alerts for this staff member
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-600" />
                      Emergency Contact
                    </h5>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-800">{selectedStaff.emergencyContact.name}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-800">{formatPhoneNumber(selectedStaff.emergencyContact.phone)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Relationship</label>
                        <p className="text-gray-800">{selectedStaff.emergencyContact.relationship}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Grade & Step</label>
                    <p className="text-gray-800">{selectedStaff.grade} - Step {selectedStaff.step}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Salary Grade</label>
                    <p className="text-gray-800">{selectedStaff.salaryGrade}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leave Balance</label>
                    <p className="text-gray-800">{selectedStaff.leaveBalance} days</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => onStaffSelect(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffTable;