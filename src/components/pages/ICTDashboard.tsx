// src/components/pages/ICTDashboard.tsx
// ICT Head Dashboard - Simple & Essential Features Only

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types/auth.types';
import { Users, FileText, UserPlus } from 'lucide-react';

const ICTDashboard: React.FC = () => {
  const { state, createUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'staff' | 'users'>('staff');
  const [showCreateUser, setShowCreateUser] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ICT Dashboard</h1>
          <p className="text-gray-600">Database Management & User Administration</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Staff Records</p>
                <p className="text-2xl font-bold">{state.staffData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">System Users</p>
                <p className="text-2xl font-bold">{state.allUsers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => setShowCreateUser(true)}
              className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Staff Account</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('staff')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'staff' 
                    ? 'border-orange-500 text-orange-600' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                Staff Database
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'users' 
                    ? 'border-orange-500 text-orange-600' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                User Accounts
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'staff' ? (
              <StaffTable staffData={state.filteredStaff} />
            ) : (
              <UsersTable users={state.allUsers} />
            )}
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateUser && (
          <CreateStaffModal
            onClose={() => setShowCreateUser(false)}
            onCreate={createUser}
          />
        )}
      </div>
    </div>
  );
};

// Staff Table
const StaffTable: React.FC<{ staffData: any[] }> = ({ staffData }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Staff Nominal Roll</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">S/N</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Rank</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Grade</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Department</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {staffData.map(staff => (
            <tr key={staff.sn} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-sm">{staff.sn}</td>
              <td className="px-4 py-2 border text-sm">{staff.nameOfOfficer}</td>
              <td className="px-4 py-2 border text-sm">{staff.rank}</td>
              <td className="px-4 py-2 border text-sm">{staff.gradeLevel}</td>
              <td className="px-4 py-2 border text-sm">{staff.department}</td>
              <td className="px-4 py-2 border text-sm">{staff.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Users Table
const UsersTable: React.FC<{ users: any[] }> = ({ users }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">System Users</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Role</th>
            <th className="px-4 py-2 border text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-sm">{user.firstName} {user.lastName}</td>
              <td className="px-4 py-2 border text-sm">{user.username}</td>
              <td className="px-4 py-2 border text-sm">{user.role}</td>
              <td className="px-4 py-2 border text-sm">
                <span className={`px-2 py-1 text-xs rounded ${
                  user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Create Staff Modal
const CreateStaffModal: React.FC<{
  onClose: () => void;
  onCreate: (userData: { firstName: string; lastName: string; email: string; role: UserRole }) => Promise<boolean>;
}> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STAFF' as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onCreate(formData);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Create Staff Account</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ICTDashboard;