// src/components/pages/DirectorDashboard.tsx
// Director Dashboard for ORGANIZATION_HEAD role

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types/auth.types';
import { Users, UserPlus, CheckCircle, BarChart3, FileText, Settings } from 'lucide-react';

const DirectorDashboard: React.FC = () => {
  const { state, createUser, approveUser, loadAllUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'staff'>('overview');
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Get pending approvals
  const pendingApprovals = state.allUsers.filter(user => user.status === 'PENDING_APPROVAL');
  const totalUsers = state.allUsers.length;
  const totalStaff = state.staffData.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Director Dashboard</h1>
          <p className="text-gray-600 mt-2">Akwa Ibom State Budget Office Management System</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals.length}
            icon={<CheckCircle className="w-6 h-6" />}
            color="orange"
          />
          <StatsCard
            title="Staff Records"
            value={totalStaff}
            icon={<FileText className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Departments"
            value={2}
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'users', label: 'User Management' },
                { key: 'approvals', label: `Approvals (${pendingApprovals.length})` },
                { key: 'staff', label: 'Staff Records' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && (
              <UsersTab 
                users={state.allUsers}
                onCreateUser={() => setShowCreateUser(true)}
                onReload={loadAllUsers}
              />
            )}
            {activeTab === 'approvals' && (
              <ApprovalsTab 
                pendingUsers={pendingApprovals}
                onApprove={approveUser}
                onReload={loadAllUsers}
              />
            )}
            {activeTab === 'staff' && <StaffTab staffData={state.filteredStaff} />}
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateUser && (
          <CreateUserModal
            onClose={() => setShowCreateUser(false)}
            onCreate={createUser}
          />
        )}
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500', 
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab: React.FC = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Recent Activities</h4>
        <p className="text-sm text-gray-600">User management and system activities will appear here.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
        <p className="text-sm text-green-600">All systems operational</p>
      </div>
    </div>
  </div>
);

// Users Tab
interface UsersTabProps {
  users: any[];
  onCreateUser: () => void;
  onReload: () => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, onCreateUser }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">User Management</h3>
      <button
        onClick={onCreateUser}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>Create User</span>
      </button>
    </div>
    
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">{user.username}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                  user.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Approvals Tab
interface ApprovalsTabProps {
  pendingUsers: any[];
  onApprove: (userId: string) => Promise<boolean>;
  onReload: () => void;
}

const ApprovalsTab: React.FC<ApprovalsTabProps> = ({ pendingUsers, onApprove }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
    
    {pendingUsers.length === 0 ? (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-500">No pending approvals</p>
      </div>
    ) : (
      <div className="space-y-4">
        {pendingUsers.map(user => (
          <div key={user.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h4>
              <p className="text-sm text-gray-500">{user.username} - {user.role}</p>
            </div>
            <button
              onClick={() => onApprove(user.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Staff Tab
interface StaffTabProps {
  staffData: any[];
}

const StaffTab: React.FC<StaffTabProps> = ({ staffData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-900">Staff Nominal Roll</h3>
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffData.map(staff => (
              <tr key={staff.sn}>
                <td className="px-4 py-4 text-sm text-gray-900">{staff.sn}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{staff.nameOfOfficer}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{staff.rank}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{staff.gradeLevel}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{staff.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Create User Modal
interface CreateUserModalProps {
  onClose: () => void;
  onCreate: (userData: { firstName: string; lastName: string; email: string; role: UserRole }) => Promise<boolean>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'ICT_HEAD' as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onCreate(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ICT_HEAD">ICT Head</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectorDashboard;