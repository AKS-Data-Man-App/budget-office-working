// src/components/pages/DirectorDashboard/components/ApprovalsTab.tsx
// User Approvals Tab - Clean with Essential Features

import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

export interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  requestedBy?: string;
}

export interface ApprovalsTabProps {
  pendingUsers: PendingUser[];
  onApprove: (userId: string) => Promise<boolean>;
  onReject?: (userId: string) => Promise<boolean>;
  loading?: boolean;
}

const ApprovalsTab: React.FC<ApprovalsTabProps> = ({ 
  pendingUsers, 
  onApprove, 
  onReject,
  loading = false 
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onApprove(userId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!onReject) return;
    setProcessingId(userId);
    try {
      await onReject(userId);
    } finally {
      setProcessingId(null);
    }
  };

  // Role mappings
  const roleLabels: Record<string, string> = {
    'ORGANIZATION_HEAD': 'Director',
    'ICT_HEAD': 'ICT Head',
    'STAFF': 'Staff'
  };

  const getRoleVariant = (role: string) => 
    role === 'ORGANIZATION_HEAD' ? 'danger' : role === 'ICT_HEAD' ? 'warning' : 'info';

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
          Pending Approvals
        </h3>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            border: '3px solid #E5E7EB', 
            borderTop: '3px solid var(--akwa-green)', 
            borderRadius: '50%', 
            margin: '0 auto 1rem auto',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6B7280', margin: 0 }}>Loading approvals...</p>
        </div>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
          Pending Approvals
        </h3>
        
        {/* Empty State */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '3rem', 
          borderRadius: '0.5rem', 
          textAlign: 'center',
          border: '1px solid #E5E7EB'
        }}>
          <CheckCircle style={{ 
            width: '3rem', 
            height: '3rem', 
            color: 'var(--akwa-green)', 
            margin: '0 auto 1rem auto' 
          }} />
          <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
            All Caught Up!
          </h4>
          <p style={{ color: '#6B7280', margin: 0 }}>
            No pending user approvals at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
          Pending Approvals
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
          Review and approve new user registration requests.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        backgroundColor: '#FFF7ED', 
        padding: '1rem', 
        borderRadius: '0.5rem', 
        border: '1px solid #FED7AA',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--akwa-orange)' }} />
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400E' }}>
            {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} awaiting approval
          </span>
          <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '0.25rem' }}>
            Please review each request carefully before approving access.
          </div>
        </div>
      </div>

      {/* Pending Users List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingUsers.map(user => (
          <div
            key={user.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              {/* User Information */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '500', 
                      color: '#111827', 
                      margin: '0 0 0.25rem 0' 
                    }}>
                      {user.firstName} {user.lastName}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Badge variant={getRoleVariant(user.role)} size="sm">
                        {roleLabels[user.role] || user.role}
                      </Badge>
                      <Clock style={{ width: '0.875rem', height: '0.875rem', color: '#9CA3AF' }} />
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div style={{ 
                  backgroundColor: '#F9FAFB', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Username:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.username}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Email:</span>
                      <div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.email}</div>
                    </div>
                    {user.requestedBy && (
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '500' }}>Requested by:</span>
                        <div style={{ fontSize: '0.875rem', color: '#111827' }}>{user.requestedBy}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(user.id)}
                  loading={processingId === user.id}
                  disabled={!!processingId}
                  icon={<CheckCircle />}
                  fullWidth
                >
                  Approve
                </Button>
                
                {onReject && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(user.id)}
                    loading={processingId === user.id}
                    disabled={!!processingId}
                    fullWidth
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Actions (if more than 2 users) */}
      {pendingUsers.length > 2 && (
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Bulk Actions ({pendingUsers.length} users selected)
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="success"
              size="sm"
              disabled={!!processingId}
              onClick={() => {
                // TODO: Implement bulk approval
                console.log('Bulk approve all users');
              }}
            >
              Approve All
            </Button>
            {onReject && (
              <Button
                variant="danger"
                size="sm"
                disabled={!!processingId}
                onClick={() => {
                  // TODO: Implement bulk rejection with confirmation
                  console.log('Bulk reject all users');
                }}
              >
                Reject All
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsTab;