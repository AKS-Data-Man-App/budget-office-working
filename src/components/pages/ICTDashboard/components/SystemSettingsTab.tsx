// src/components/pages/ICTDashboard/components/SystemSettingsTab.tsx
// System Settings Tab - Compact Version

import React, { useState } from 'react';
import { Database, Shield, Download, Upload, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';

const SystemSettingsTab: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState('success');
  const [lastBackup] = useState(new Date().toLocaleString());
  const [systemHealth] = useState({ database: 'healthy', server: 'healthy', storage: 'warning' });

  const handleAction = (action: string) => {
    const actions = {
      backup: () => {
        setBackupStatus('loading');
        setTimeout(() => { setBackupStatus('success'); alert('Database backup completed!'); }, 2000);
      },
      restore: () => confirm('Are you sure you want to restore from backup? This will overwrite current data.') && alert('Restore initiated!'),
      sync: () => alert('Database synchronization started!'),
      maintenance: () => confirm('Enable maintenance mode? Users will be unable to access the system.') && alert('Maintenance mode enabled!'),
      export: () => alert('System configuration exported successfully!'),
      import: () => alert('Import configuration functionality coming soon!')
    };
    actions[action as keyof typeof actions]?.();
  };

  const settings = [
    {
      title: 'Database Management',
      description: 'Backup, restore, and maintain database integrity',
      icon: Database,
      color: 'var(--akwa-green)',
      actions: [
        { label: 'Create Backup', action: 'backup', variant: 'primary', loading: backupStatus === 'loading' },
        { label: 'Restore Database', action: 'restore', variant: 'warning' },
        { label: 'Sync Data', action: 'sync', variant: 'info' }
      ]
    },
    {
      title: 'Security & Access Control',
      description: 'Manage system security and user permissions',
      icon: Shield,
      color: 'var(--akwa-orange)',
      actions: [
        { label: 'Security Audit', action: 'audit', variant: 'warning' },
        { label: 'Reset Permissions', action: 'permissions', variant: 'danger' },
        { label: 'System Logs', action: 'logs', variant: 'info' }
      ]
    },
    {
      title: 'System Maintenance',
      description: 'Performance optimization and system health',
      icon: RefreshCw,
      color: '#8B5CF6',
      actions: [
        { label: 'Maintenance Mode', action: 'maintenance', variant: 'warning' },
        { label: 'Clear Cache', action: 'cache', variant: 'info' },
        { label: 'Optimize Database', action: 'optimize', variant: 'success' }
      ]
    },
    {
      title: 'Configuration Management',
      description: 'Import and export system configurations',
      icon: Upload,
      color: '#3B82F6',
      actions: [
        { label: 'Export Config', action: 'export', variant: 'success' },
        { label: 'Import Config', action: 'import', variant: 'primary' },
        { label: 'Reset to Default', action: 'reset', variant: 'danger' }
      ]
    }
  ];

  const healthStatus = [
    { component: 'Database Connection', status: systemHealth.database, message: 'All connections stable' },
    { component: 'Server Performance', status: systemHealth.server, message: 'Running optimally' },
    { component: 'Storage Space', status: systemHealth.storage, message: '78% used - Consider cleanup' },
    { component: 'Backup System', status: backupStatus === 'success' ? 'healthy' : 'warning', message: `Last backup: ${lastBackup}` }
  ];

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'info' | 'danger' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'danger'> = {
      'healthy': 'success', 'warning': 'warning', 'error': 'danger', 'loading': 'info'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'healthy': <CheckCircle style={{ width: '1rem', height: '1rem', color: '#22C55E' }} />,
      'warning': <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#F59E0B' }} />,
      'error': <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#EF4444' }} />
    };
    return icons[status] || <CheckCircle style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
          System Settings & Configuration
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
          Manage database, security, and system maintenance settings
        </p>
      </div>

      {/* System Health Status */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database style={{ width: '1.25rem', height: '1.25rem', color: 'var(--akwa-green)' }} />
          System Health Status
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {healthStatus.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.375rem' }}>
              {getStatusIcon(item.status)}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{item.component}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.message}</div>
              </div>
              <Badge variant={getStatusColor(item.status)} size="sm">
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Categories */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {settings.map((setting, index) => {
          const Icon = setting.icon;
          return (
            <div key={index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: `${setting.color}20`, borderRadius: '0.5rem' }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: setting.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
                    {setting.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                    {setting.description}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {setting.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={action.variant as any}
                    size="sm"
                    onClick={() => handleAction(action.action)}
                    disabled={action.loading}
                  >
                    {action.loading ? 'Processing...' : action.label}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 1rem 0' }}>
          Quick Actions
        </h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Full System Backup', icon: Download, variant: 'primary', action: 'backup' },
            { label: 'Export All Data', icon: Upload, variant: 'success', action: 'export' },
            { label: 'System Restart', icon: RefreshCw, variant: 'warning', action: 'restart' },
            { label: 'Emergency Mode', icon: AlertTriangle, variant: 'danger', action: 'emergency' }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant={item.variant as any}
                size="md"
                icon={<Icon />}
                onClick={() => handleAction(item.action)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsTab;