// src/components/pages/DirectorDashboard/components/UsersTab.tsx
// Enhanced User Management Tab with Auto Password Reset Email

import React, { useState, useMemo, useEffect } from 'react';
import { UserPlus, Search, Eye, Key, UserX, RefreshCw, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Table, { TableColumn } from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import Modal from '../../../common/Modal';

interface User {
  id: string; firstName: string; lastName: string; username: string;
  email: string; role: string; status: string; createdAt?: string;
}

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [createUserData, setCreateUserData] = useState({ firstName: '', lastName: '', email: '', role: 'ICT_HEAD' });

  const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://budget-office-backend.onrender.com${endpoint}`, {
      method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      ...(data && method !== 'GET' && { body: JSON.stringify(data) })
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/v1/users');
      const usersData = (response.data || []).map((user: any) => ({
        id: user.id, firstName: user.firstName, lastName: user.lastName,
        username: user.username || user.email, email: user.email, role: user.role,
        status: user.status, createdAt: user.createdAt
      }));
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const { filteredUsers, stats } = useMemo(() => {
    const filtered = users.filter(user => {
      const searchMatch = !search || `${user.firstName} ${user.lastName} ${user.username} ${user.email}`.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === 'all' || user.status === statusFilter;
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      return searchMatch && statusMatch && roleMatch;
    });
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'ACTIVE').length,
      pending: users.filter(u => u.status === 'PENDING_APPROVAL').length,
      activation: users.filter(u => u.status === 'APPROVED_PENDING_ACTIVATION').length
    };
    return { filteredUsers: filtered, stats };
  }, [users, search, statusFilter, roleFilter]);

  const handleCreateUser = async () => {
    if (!createUserData.firstName || !createUserData.lastName || !createUserData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const loadingToast = toast.loading('Creating user...');
    try {
      // Step 1: Create the user
      const userData = { 
        ...createUserData, 
        username: createUserData.email, 
        password: `temp${Date.now()}`, 
        office: 'Budget Office', 
        state: 'Akwa Ibom' 
      };
      
      const createResponse = await apiCall('/api/v1/users', 'POST', userData);
      const newUserId = createResponse.data?.userId;
      
      if (!newUserId) {
        throw new Error('User created but ID not returned');
      }

      // Step 2: Automatically send password reset email
      toast.loading('Sending password reset email...', { id: loadingToast });
      
      try {
        await apiCall(`/api/v1/users/${newUserId}/reset-password-request`, 'POST');
        
        // Success: User created AND email sent
        toast.success(
          `✅ ${createUserData.firstName} ${createUserData.lastName} created successfully!\n📧 Password reset email sent to ${createUserData.email}`, 
          { 
            id: loadingToast,
            duration: 6000,
          }
        );
        
      } catch (emailError) {
        // User created but email failed - still success but with warning
        toast.success(
          `✅ ${createUserData.firstName} ${createUserData.lastName} created successfully!\n⚠️ Email sending failed - you can manually send reset email later`, 
          { 
            id: loadingToast,
            duration: 8000,
          }
        );
      }
      
      // Clean up and reload
      setShowCreateUser(false);
      setCreateUserData({ firstName: '', lastName: '', email: '', role: 'ICT_HEAD' });
      await loadUsers();
      
    } catch (error) {
      toast.error('Failed to create user', { id: loadingToast });
    }
  };

  const handleUserAction = async (userId: string, userName: string, action: 'activate' | 'deactivate' | 'reset' | 'view' | 'role') => {
    if (action === 'view') {
      const user = users.find(u => u.id === userId);
      if (user) toast.success(`${user.firstName} ${user.lastName} • ${roleLabels[user.role]} • ${user.email} • Status: ${statusLabels[user.status] || user.status}`, { duration: 8000 });
      return;
    }

    setProcessingId(userId);
    const actionMap = { 
      activate: 'Activating', 
      deactivate: 'Deactivating', 
      reset: 'Sending password reset email to',
      role: 'Updating role for'
    };
    const loadingToast = toast.loading(`${actionMap[action]} ${userName}...`);

    try {
      if (action === 'activate') {
        await apiCall(`/api/v1/users/${userId}/activate`, 'POST');
        toast.success(`${userName} activated successfully!`, { id: loadingToast });
      } else if (action === 'deactivate') {
        await apiCall(`/api/v1/users/${userId}/deactivate`, 'POST');
        toast.success(`${userName} deactivated successfully!`, { id: loadingToast });
      } else if (action === 'reset') {
        await apiCall(`/api/v1/users/${userId}/reset-password-request`, 'POST');
        toast.success(`Password reset email sent to ${userName}!`, { id: loadingToast });
      }
      await loadUsers();
    } catch (error) {
      toast.error(`Failed to ${action} user`, { id: loadingToast });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (userId: string, userName: string, newRole: string) => {
    const loadingToast = toast.loading(`Updating role for ${userName}...`);
    
    try {
      await apiCall(`/api/v1/users/${userId}/role`, 'PATCH', { role: newRole });
      toast.success(`${userName} role updated to ${roleLabels[newRole]}!`, { id: loadingToast });
      await loadUsers();
    } catch (error) {
      toast.error('Failed to update user role', { id: loadingToast });
    }
  };

  const roleLabels: Record<string, string> = { 'ORGANIZATION_HEAD': 'Director', 'ICT_HEAD': 'ICT Head', 'STAFF': 'Staff' };
  const statusLabels: Record<string, string> = { 'APPROVED_PENDING_ACTIVATION': 'Pending Activation', 'PENDING_APPROVAL': 'Pending Approval', 'ACTIVE': 'Active', 'INACTIVE': 'Inactive' };
  const getStatusVariant = (status: string) => status === 'ACTIVE' ? 'success' : status === 'INACTIVE' ? 'danger' : status === 'PENDING_APPROVAL' ? 'warning' : 'info';
  const getRoleVariant = (role: string) => role === 'ORGANIZATION_HEAD' ? 'danger' : role === 'ICT_HEAD' ? 'warning' : 'info';

  const columns: TableColumn[] = [
    {
      key: 'user', header: 'User',
      render: (_, user: User) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{user.firstName} {user.lastName}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{user.username}</div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{user.email}</div>
        </div>
      )
    },
    { 
      key: 'role', 
      header: 'Role', 
      render: (role: string, user: User) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Badge variant={getRoleVariant(role)} size="sm">{roleLabels[role] || role}</Badge>
          {user.role !== 'ORGANIZATION_HEAD' && (
            <select 
              value={role} 
              onChange={(e) => handleRoleChange(user.id, `${user.firstName} ${user.lastName}`, e.target.value)}
              style={{ fontSize: '0.75rem', padding: '0.125rem 0.25rem', border: '1px solid #D1D5DB', borderRadius: '0.25rem', backgroundColor: 'white' }}
            >
              <option value="ICT_HEAD">ICT Head</option>
              <option value="STAFF">Staff</option>
            </select>
          )}
        </div>
      )
    },
    { key: 'status', header: 'Status', render: (status: string) => <Badge variant={getStatusVariant(status)} size="sm">{statusLabels[status] || status}</Badge> },
    { key: 'created', header: 'Created', render: (_, user: User) => <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span> },
    {
      key: 'actions', header: 'Actions',
      render: (_, user: User) => (
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleUserAction(user.id, `${user.firstName} ${user.lastName}`, 'view')} style={{ padding: '0.25rem', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }} title="View Details">
            <Eye style={{ width: '0.75rem', height: '0.75rem' }} />
          </button>
          
          {user.status === 'APPROVED_PENDING_ACTIVATION' && (
            <button onClick={() => handleUserAction(user.id, `${user.firstName} ${user.lastName}`, 'activate')} disabled={!!processingId} style={{ padding: '0.25rem', backgroundColor: 'var(--akwa-green)', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }} title="Activate User">
              <Users style={{ width: '0.75rem', height: '0.75rem' }} />
            </button>
          )}
          
          <button onClick={() => handleUserAction(user.id, `${user.firstName} ${user.lastName}`, 'reset')} disabled={!!processingId} style={{ padding: '0.25rem', backgroundColor: 'var(--akwa-orange)', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }} title="Send Password Reset Email">
            <Key style={{ width: '0.75rem', height: '0.75rem' }} />
          </button>
          
          {user.status === 'ACTIVE' && (
            <button onClick={() => handleUserAction(user.id, `${user.firstName} ${user.lastName}`, 'deactivate')} disabled={!!processingId} style={{ padding: '0.25rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }} title="Deactivate User">
              <UserX style={{ width: '0.75rem', height: '0.75rem' }} />
            </button>
          )}
          
          {user.status === 'INACTIVE' && (
            <button onClick={() => handleUserAction(user.id, `${user.firstName} ${user.lastName}`, 'activate')} disabled={!!processingId} style={{ padding: '0.25rem', backgroundColor: 'var(--akwa-green)', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }} title="Reactivate User">
              <RefreshCw style={{ width: '0.75rem', height: '0.75rem' }} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>User Management</h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Create users and they'll automatically receive password reset emails</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" size="sm" icon={<RefreshCw />} onClick={loadUsers} loading={loading}>Refresh</Button>
          <Button variant="gradient" size="md" icon={<UserPlus />} onClick={() => setShowCreateUser(true)}>Create User</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total', value: stats.total, color: '#6B7280', icon: '👥' },
          { label: 'Active', value: stats.active, color: 'var(--akwa-green)', icon: '✅' },
          { label: 'Pending', value: stats.pending, color: 'var(--akwa-orange)', icon: '⏳' },
          { label: 'Activation', value: stats.activation, color: '#3B82F6', icon: '🔄' }
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white' }}>
          <option value="all">All Roles</option>
          <option value="ORGANIZATION_HEAD">Director</option>
          <option value="ICT_HEAD">ICT Head</option>
          <option value="STAFF">Staff</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white' }}>
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED_PENDING_ACTIVATION">Pending Activation</option>
        </select>
        {(search || statusFilter !== 'all' || roleFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); setRoleFilter('all'); }}>Clear</Button>
        )}
      </div>

      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredUsers.length} of {users.length} users{search && ` matching "${search}"`}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <Table columns={columns} data={filteredUsers} keyField="id" loading={loading} emptyMessage={search || statusFilter !== 'all' || roleFilter !== 'all' ? "No users match your filters." : "No users created yet. Click 'Create User' to add the first user."} size="sm" />
      </div>

      <Modal isOpen={showCreateUser} onClose={() => setShowCreateUser(false)} title="Create New User" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#EBF8FF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #90CDF4' }}>
            <p style={{ fontSize: '0.875rem', color: '#1E40AF', margin: 0 }}>
              📧 <strong>Auto Email:</strong> When you create a user, they'll automatically receive a password reset email to set up their account.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>First Name *</label>
              <input type="text" value={createUserData.firstName} onChange={(e) => setCreateUserData(prev => ({ ...prev, firstName: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} placeholder="Enter first name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Last Name *</label>
              <input type="text" value={createUserData.lastName} onChange={(e) => setCreateUserData(prev => ({ ...prev, lastName: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} placeholder="Enter last name" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Email Address *</label>
            <input type="email" value={createUserData.email} onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} placeholder="user@budgetoffice.gov.ng" />
            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>The user will receive a password reset email at this address</p>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Role</label>
            <select value={createUserData.role} onChange={(e) => setCreateUserData(prev => ({ ...prev, role: e.target.value }))} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
              <option value="ICT_HEAD">ICT Head</option>
              <option value="STAFF">Staff</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>As Director, you can create ICT Head accounts. ICT Heads can create Staff accounts.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
            <Button variant="ghost" onClick={() => setShowCreateUser(false)}>Cancel</Button>
            <Button variant="success" onClick={handleCreateUser} icon={<UserPlus />}>Create User & Send Email</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersTab;