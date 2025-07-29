// src/components/pages/DirectorDashboard/components/ApprovalsTab.tsx
// Compact User Approvals Tab with Full Backend Integration

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  requestedBy?: string;
}

const ApprovalsTab: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://budget-office-backend.onrender.com${endpoint}`, {
      method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      ...(data && method !== 'GET' && { body: JSON.stringify(data) })
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  };

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/v1/users/pending');
      const users = (response.data || []).map((user: any) => ({
        id: user.id, firstName: user.firstName, lastName: user.lastName,
        username: user.username || user.email, email: user.email, role: user.role,
        status: user.status, createdAt: user.createdAt,
        requestedBy: user.createdBy?.firstName ? `${user.createdBy.firstName} ${user.createdBy.lastName}` : undefined
      }));
      setPendingUsers(users);
    } catch (error) {
      toast.error('Failed to load pending approvals');
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPendingUsers(); }, []);

  const handleAction = async (userId: string, userName: string, action: 'approve' | 'activate' | 'reject') => {
    if (action === 'reject') {
      toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X style={{ width: '1.5rem', height: '1.5rem', color: '#EF4444' }} />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#111827' }}>Reject User Registration</div>
              <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>This action cannot be undone</div>
            </div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
            <div style={{ fontWeight: '500', color: '#374151' }}>{userName}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => toast.dismiss(t.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Cancel</button>
            <button onClick={async () => { toast.dismiss(t.id); await performAction(userId, userName, 'reject'); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>Reject</button>
          </div>
        </div>
      ), { duration: Infinity, position: 'top-center' });
      return;
    }
    await performAction(userId, userName, action);
  };

  const performAction = async (userId: string, userName: string, action: 'approve' | 'activate' | 'reject') => {
    setProcessingId(userId);
    const actionMap = { approve: 'Approving', activate: 'Activating', reject: 'Rejecting' };
    const loadingToast = toast.loading(`${actionMap[action]} ${userName}...`);
    
    try {
      const endpoint = action === 'reject' ? `/api/v1/users/${userId}` : `/api/v1/users/${userId}/${action}`;
      const method = action === 'reject' ? 'DELETE' : 'POST';
      await apiCall(endpoint, method);
      
      const successMap = { approve: 'approved', activate: 'activated', reject: 'registration rejected' };
      toast.success(`${userName} ${successMap[action]} successfully!`, { id: loadingToast });
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      await loadPendingUsers();
    } catch (error) {
      toast.error(`Failed to ${action} ${userName}`, { id: loadingToast });
    } finally {
      setProcessingId(null);
    }
  };

  const handleBulkApprove = async () => {
    setBulkProcessing(true);
    const loadingToast = toast.loading(`Approving ${pendingUsers.length} users...`);
    try {
      await Promise.all(pendingUsers.map(user => apiCall(`/api/v1/users/${user.id}/approve`, 'POST')));
      toast.success(`${pendingUsers.length} users approved successfully!`, { id: loadingToast });
      setPendingUsers([]);
      await loadPendingUsers();
    } catch (error) {
      toast.error('Some approvals failed. Please try individually.', { id: loadingToast });
    } finally {
      setBulkProcessing(false);
    }
  };

  const roleLabels: Record<string, string> = { 'ORGANIZATION_HEAD': 'Director', 'ICT_HEAD': 'ICT Head', 'STAFF': 'Staff' };
  const getRoleVariant = (role: string) => role === 'ORGANIZATION_HEAD' ? 'danger' : role === 'ICT_HEAD' ? 'warning' : 'info';
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL': return { label: 'Pending Approval', action: 'approve' as const, variant: 'warning' as const };
      case 'APPROVED_PENDING_ACTIVATION': return { label: 'Pending Activation', action: 'activate' as const, variant: 'info' as const };
      default: return { label: status, action: 'approve' as const, variant: 'secondary' as const };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Pending Approvals</h3>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <div style={{ width: '2rem', height: '2rem', border: '3px solid #E5E7EB', borderTop: '3px solid var(--akwa-green)', borderRadius: '50%', margin: '0 auto 1rem auto', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6B7280', margin: 0 }}>Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Pending Approvals</h3>
          <Button variant="ghost" size="sm" onClick={loadPendingUsers} loading={loading}>Refresh</Button>
        </div>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <CheckCircle style={{ width: '3rem', height: '3rem', color: 'var(--akwa-green)', margin: '0 auto 1rem auto' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>All Caught Up!</h4>
          <p style={{ color: '#6B7280', margin: 0 }}>No pending user approvals at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>Pending Approvals</h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Review and approve new user registration requests.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadPendingUsers} loading={loading}>Refresh</Button>
      </div>

      <div style={{ backgroundColor: '#FFF7ED', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #FED7AA', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--akwa-orange)' }} />
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400E' }}>
            {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} awaiting approval
          </span>
          <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '0.25rem' }}>Please review each request carefully before approving access.</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingUsers.map(user => {
          const statusInfo = getStatusInfo(user.status);
          const userName = `${user.firstName} ${user.lastName}`;
          
          return (
            <div key={user.id} style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>{userName}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Badge variant={getRoleVariant(user.role)} size="sm">{roleLabels[user.role] || user.role}</Badge>
                        <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
                        <Clock style={{ width: '0.875rem', height: '0.875rem', color: '#9CA3AF' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: '#F9FAFB', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      <div><span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Username:</span><div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.username}</div></div>
                      <div><span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Email:</span><div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.email}</div></div>
                      {user.requestedBy && <div><span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Requested by:</span><div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.requestedBy}</div></div>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}>
                  {statusInfo.action === 'approve' && (
                    <Button variant="success" size="sm" onClick={() => handleAction(user.id, userName, 'approve')} loading={processingId === user.id} disabled={!!processingId || bulkProcessing} icon={<CheckCircle />} fullWidth>Approve</Button>
                  )}
                  {statusInfo.action === 'activate' && (
                    <Button variant="primary" size="sm" onClick={() => handleAction(user.id, userName, 'activate')} loading={processingId === user.id} disabled={!!processingId || bulkProcessing} icon={<Users />} fullWidth>Activate</Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleAction(user.id, userName, 'reject')} loading={processingId === user.id} disabled={!!processingId || bulkProcessing} fullWidth>Reject</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pendingUsers.length > 1 && (
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Bulk Actions ({pendingUsers.length} users selected)</span>
          <Button variant="success" size="sm" disabled={!!processingId || bulkProcessing} loading={bulkProcessing} onClick={handleBulkApprove}>Approve All</Button>
        </div>
      )}
    </div>
  );
};

export default ApprovalsTab;