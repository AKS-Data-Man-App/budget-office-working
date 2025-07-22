// src/components/pages/DirectorDashboard.tsx
// Director Dashboard using same styling approach as HomePage

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
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header matching homepage style */}
      <header className="akwa-header">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h1 className="header-title">
              Director Dashboard
            </h1>
            <p className="header-subtitle">
              Akwa Ibom State Budget Office Management System
            </p>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<Users style={{ width: '1.5rem', height: '1.5rem' }} />}
            color="blue"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals.length}
            icon={<CheckCircle style={{ width: '1.5rem', height: '1.5rem' }} />}
            color="orange"
          />
          <StatsCard
            title="Staff Records"
            value={totalStaff}
            icon={<FileText style={{ width: '1.5rem', height: '1.5rem' }} />}
            color="green"
          />
          <StatsCard
            title="Departments"
            value={2}
            icon={<BarChart3 style={{ width: '1.5rem', height: '1.5rem' }} />}
            color="purple"
          />
        </div>

        {/* Navigation Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ borderBottom: '1px solid #E5E7EB' }}>
            <nav style={{ display: 'flex', padding: '0 1.5rem' }}>
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'users', label: 'User Management' },
                { key: 'approvals', label: `Approvals (${pendingApprovals.length})` },
                { key: 'staff', label: 'Staff Records' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: '1rem 0.5rem',
                    borderBottom: activeTab === tab.key ? '2px solid var(--akwa-green)' : '2px solid transparent',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    color: activeTab === tab.key ? 'var(--akwa-green)' : '#6B7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '2rem'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '1.5rem' }}>
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
    blue: '#3B82F6',
    orange: 'var(--akwa-orange)', 
    green: 'var(--akwa-green)',
    purple: '#8B5CF6'
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          backgroundColor: colorClasses[color],
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          {icon}
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6B7280', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>{value}</p>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>System Overview</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div style={{
        backgroundColor: '#F9FAFB',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <h4 style={{ fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>Recent Activities</h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>User management and system activities will appear here.</p>
      </div>
      <div style={{
        backgroundColor: '#F9FAFB',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <h4 style={{ fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>System Status</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--akwa-green)', margin: 0 }}>All systems operational</p>
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>User Management</h3>
      <button
        onClick={onCreateUser}
        style={{
          background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '500'
        }}
      >
        <UserPlus style={{ width: '1rem', height: '1rem' }} />
        <span>Create User</span>
      </button>
    </div>
    
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>User</th>
            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Role</th>
            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} style={{ borderTop: index > 0 ? '1px solid #E5E7EB' : 'none' }}>
              <td style={{ padding: '1rem 1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{user.username}</div>
                </div>
              </td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>{user.role}</td>
              <td style={{ padding: '1rem 1.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: user.status === 'ACTIVE' ? '#DCFCE7' : user.status === 'PENDING_APPROVAL' ? '#FEF3C7' : '#F3F4F6',
                  color: user.status === 'ACTIVE' ? '#166534' : user.status === 'PENDING_APPROVAL' ? '#92400E' : '#374151'
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Pending Approvals</h3>
    
    {pendingUsers.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <CheckCircle style={{ width: '3rem', height: '3rem', color: 'var(--akwa-green)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: '#6B7280', margin: 0 }}>No pending approvals</p>
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingUsers.map(user => (
          <div key={user.id} style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>{user.firstName} {user.lastName}</h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>{user.username} - {user.role}</p>
            </div>
            <button
              onClick={() => onApprove(user.id)}
              style={{
                backgroundColor: 'var(--akwa-green)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Staff Nominal Roll</h3>
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>S/N</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Rank</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Grade</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>Department</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff, index) => (
              <tr key={staff.sn} style={{ borderTop: index > 0 ? '1px solid #E5E7EB' : 'none' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#111827' }}>{staff.sn}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#111827' }}>{staff.nameOfOfficer}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#111827' }}>{staff.rank}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#111827' }}>{staff.gradeLevel}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#111827' }}>{staff.department}</td>
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '28rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 1rem 0' }}>Create New User</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              style={{
                width: '100%',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              style={{
                width: '100%',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
              style={{
                width: '100%',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="ICT_HEAD">ICT Head</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                border: '1px solid #D1D5DB',
                color: '#374151',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: 'var(--akwa-green)',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
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