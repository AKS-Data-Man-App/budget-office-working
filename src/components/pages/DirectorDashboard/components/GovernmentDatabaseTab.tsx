// src/components/pages/DirectorDashboard/components/GovernmentDatabaseTab.tsx
// Enhanced Government Database Tab - Updated with Toast Notifications

import React, { useState, useMemo } from 'react';
import { Search, Download, Database, UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Table, { TableColumn } from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import Modal from '../../../common/Modal';
import { useAppContext } from '../../../../context/AppContext';
import CreateStaffForm from './CreateStaffForm';

const GovernmentDatabaseTab: React.FC = () => {
  const { state, loadNominalRoll } = useAppContext();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [lgaFilter, setLgaFilter] = useState('all');
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isICTHead = state.user?.role === 'ICT_HEAD';

  // Filter staff data
  const { filteredStaff, departments, lgas } = useMemo(() => {
    const data = state.staffData || [];
    const filtered = data.filter((staff: any) => {
      const searchMatch = !search || `${staff.firstName || staff.nameOfOfficer} ${staff.lastName} ${staff.rank} ${staff.department} ${staff.lga}`.toLowerCase().includes(search.toLowerCase());
      const deptMatch = departmentFilter === 'all' || staff.department === departmentFilter;
      const lgaMatch = lgaFilter === 'all' || staff.lga === lgaFilter;
      return searchMatch && deptMatch && lgaMatch;
    });
    const departments = Array.from(new Set(data.map((s: any) => s.department))).sort();
    const lgas = Array.from(new Set(data.map((s: any) => s.lga))).sort();
    return { filteredStaff: filtered, departments, lgas };
  }, [state.staffData, search, departmentFilter, lgaFilter]);

  // API Helper
  const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
    const token = localStorage.getItem('token');
    const config: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      ...(data && method !== 'GET' && { body: JSON.stringify(data) })
    };
    const response = await fetch(`https://budget-office-backend.onrender.com${endpoint}`, config);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  };

  // Transform form data for API
  const transformStaffData = (staffData: any) => ({
    employeeId: staffData.employeeId || `AKS${Date.now()}`,
    firstName: staffData.firstName,
    lastName: staffData.lastName,
    sex: staffData.sex,
    dateOfBirth: staffData.dateOfBirth ? new Date(staffData.dateOfBirth).toISOString() : null,
    dateOfFirstAppointment: staffData.dateOfFirstAppointment ? new Date(staffData.dateOfFirstAppointment).toISOString() : null,
    dateOfConfirmation: staffData.dateOfConfirmation ? new Date(staffData.dateOfConfirmation).toISOString() : null,
    dateOfLastPromotion: staffData.dateOfLastPromotion ? new Date(staffData.dateOfLastPromotion).toISOString() : null,
    rank: staffData.rank,
    gradeLevel: staffData.gradeLevel,
    step: staffData.step ? parseInt(staffData.step) : null,
    educationalQualification: staffData.educationalQualification,
    lga: staffData.lga,
    remarks: staffData.remarks,
    email: staffData.email,
    phoneNumber: staffData.phoneNumber,
    departmentId: staffData.departmentId
  });

  // CRUD Handlers
  const handleCRUD = async (action: string, staffData?: any, staff?: any) => {
    if (!isICTHead && action !== 'view') {
      toast.error('Only ICT Head can modify staff records', { duration: 5000 });
      return;
    }

    // Show loading toast for operations that take time
    const loadingToast = ['create', 'update', 'delete'].includes(action) 
      ? toast.loading(`${action === 'create' ? 'Creating' : action === 'update' ? 'Updating' : 'Deleting'} staff member...`)
      : null;

    try {
      setIsLoading(true);
      let result;

      switch (action) {
        case 'create':
          result = await apiCall('/api/v1/staff', 'POST', transformStaffData(staffData));
          toast.success(
            `Staff member ${staffData.firstName} ${staffData.lastName} created successfully!`,
            { id: loadingToast!, duration: 5000 }
          );
          setShowCreateStaff(false);
          // Refresh staff data
          await loadNominalRoll();
          break;

        case 'update':
          result = await apiCall(`/api/v1/staff/${selectedStaff.id}`, 'PUT', transformStaffData(staffData));
          toast.success(
            `Staff member ${staffData.firstName} ${staffData.lastName} updated successfully!`,
            { id: loadingToast!, duration: 5000 }
          );
          setShowEditStaff(false);
          setSelectedStaff(null);
          // Refresh staff data
          await loadNominalRoll();
          break;

        case 'delete':
          if (!window.confirm(`Delete ${staff.firstName || staff.nameOfOfficer} ${staff.lastName}?`)) {
            toast.dismiss(loadingToast!);
            return;
          }
          result = await apiCall(`/api/v1/staff/${staff.id}`, 'DELETE');
          toast.success(
            `Staff member ${staff.firstName || staff.nameOfOfficer} ${staff.lastName} deleted successfully!`,
            { id: loadingToast!, duration: 5000 }
          );
          // Refresh staff data
          await loadNominalRoll();
          break;

        case 'view':
          result = await apiCall(`/api/v1/staff/${staff.id}`);
          const staffInfo = result.data;
          toast(
            (t) => (
              <div style={{ maxWidth: '300px' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                  {staffInfo.firstName} {staffInfo.lastName}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.4' }}>
                  <div><strong>Rank:</strong> {staffInfo.rank}</div>
                  <div><strong>Department:</strong> {staffInfo.department?.name || 'N/A'}</div>
                  <div><strong>Grade:</strong> {staffInfo.gradeLevel} Step {staffInfo.step}</div>
                  <div><strong>Email:</strong> {staffInfo.email || 'N/A'}</div>
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--akwa-green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            ),
            { duration: 10000 }
          );
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(
        `Failed to ${action} staff member. ${errorMessage}`,
        { 
          id: loadingToast!, 
          duration: 6000 
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Export Handler
  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => {
        // Simulate export delay
        setTimeout(() => {
          resolve(`${filteredStaff.length} records exported to Excel`);
        }, 2000);
      }),
      {
        loading: 'Preparing Excel export...',
        success: (message) => `${message} successfully!`,
        error: 'Failed to export records'
      }
    );
  };

  // Helper functions
  const getGradeColor = (grade: string): 'default' | 'success' | 'warning' | 'info' | 'danger' | 'primary' | 'secondary' => {
    const level = parseInt(grade?.replace('GL-', '') || '0');
    return level >= 17 ? 'danger' : level >= 15 ? 'warning' : level >= 12 ? 'primary' : 'info';
  };

  const getStatusFromRemarks = (remarks: string) => {
    if (remarks?.toLowerCase().includes('retirement')) return { label: 'Due for Retirement', variant: 'warning' as const };
    if (remarks?.toLowerCase().includes('leave')) return { label: 'On Leave', variant: 'info' as const };
    if (remarks?.toLowerCase().includes('excellent')) return { label: 'Excellent', variant: 'success' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  // Table columns
  const columns: TableColumn[] = [
    { key: 'sn', header: 'S/N', width: '60px', render: (sn: number) => <span style={{ fontWeight: '500', color: '#6B7280' }}>{sn}</span> },
    {
      key: 'officer', header: 'Name of Officer', width: '200px',
      render: (_, staff: any) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{staff.firstName || staff.nameOfOfficer} {staff.lastName}</div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{staff.sex} • {staff.lga}</div>
        </div>
      )
    },
    { key: 'employeeId', header: 'Employee ID', width: '120px', render: (_, staff: any) => <div style={{ fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace' }}>{staff.employeeId || 'N/A'}</div> },
    { key: 'rank', header: 'Rank', width: '180px', render: (rank: string) => <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{rank}</div> },
    {
      key: 'grade', header: 'Grade Level', width: '120px',
      render: (_, staff: any) => (
        <div>
          <Badge variant={getGradeColor(staff.gradeLevel)} size="sm">{staff.gradeLevel}</Badge>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>Step {staff.step}</div>
        </div>
      )
    },
    { key: 'department', header: 'Department', width: '160px', render: (_, staff: any) => <div style={{ fontSize: '0.875rem', color: '#374151' }}>{staff.department?.name || staff.department}</div> },
    {
      key: 'status', header: 'Status', width: '120px',
      render: (_, staff: any) => {
        const status = getStatusFromRemarks(staff.remarks);
        return <Badge variant={status.variant} size="sm">{status.label}</Badge>;
      }
    }
  ];

  // Add actions for ICT Head
  if (isICTHead) {
    columns.push({
      key: 'actions', header: 'Actions', width: '150px',
      render: (_, staff: any) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {[
            { icon: Eye, action: () => handleCRUD('view', null, staff), color: '#3B82F6', title: 'View Details' },
            { icon: Edit, action: () => { setSelectedStaff(staff); setShowEditStaff(true); }, color: 'var(--akwa-green)', title: 'Edit Staff' },
            { icon: Trash2, action: () => handleCRUD('delete', null, staff), color: '#EF4444', title: 'Delete Staff' }
          ].map(({ icon: Icon, action, color, title }, idx) => (
            <button key={idx} onClick={action} title={title} style={{ padding: '0.25rem', border: 'none', borderRadius: '0.25rem', backgroundColor: color, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon style={{ width: '0.875rem', height: '0.875rem' }} />
            </button>
          ))}
        </div>
      )
    });
  }

  const stats = [
    { label: 'Total Staff', value: state.staffData?.length || 0, color: '#374151', icon: '👥' },
    { label: 'Departments', value: departments.length, color: 'var(--akwa-green)', icon: '🏢' },
    { label: 'LGAs', value: lgas.length, color: 'var(--akwa-orange)', icon: '🗺️' },
    { label: 'Near Retirement', value: filteredStaff.filter((s: any) => s.dateOfRetirement && new Date(s.dateOfRetirement).getFullYear() <= new Date().getFullYear() + 2).length, color: '#EF4444', icon: '📅' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>STAFF NOMINAL ROLL OF STATE BUDGET OFFICE</h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Governor's Office Annex Uyo - July 2025 • Akwa Ibom State - "The Land of Promise"</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isICTHead && (
            <Button variant="gradient" size="md" icon={<UserPlus />} onClick={() => setShowCreateStaff(true)} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Create New Staff'}
            </Button>
          )}
          <div style={{ background: 'linear-gradient(135deg, var(--akwa-orange) 0%, var(--akwa-green) 100%)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database style={{ width: '1rem', height: '1rem' }} />
            {state.staffData?.length || 0} Total Staff
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
          <input type="text" placeholder="Search by name, rank, department, or LGA..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
        </div>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '150px' }}>
          <option value="all">All Departments</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
        <select value={lgaFilter} onChange={(e) => setLgaFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '120px' }}>
          <option value="all">All LGAs</option>
          {lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
        </select>
        <Button variant="success" size="sm" icon={<Download />} onClick={handleExport}>Export</Button>
        {(search || departmentFilter !== 'all' || lgaFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDepartmentFilter('all'); setLgaFilter('all'); }}>Clear</Button>
        )}
      </div>

      {/* Results */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredStaff.length} of {state.staffData?.length || 0} government employees{search && ` matching "${search}"`}
        {isICTHead && <span style={{ marginLeft: '1rem', color: 'var(--akwa-green)', fontWeight: '500' }}>• Full database access enabled</span>}
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredStaff} keyField="id" loading={state.isLoading || isLoading} emptyMessage={search || departmentFilter !== 'all' || lgaFilter !== 'all' ? "No government employees match your filters." : "Loading official government staff database..."} size="md" onRowClick={(staff) => console.log('View staff record:', staff)} />

      {/* Footer */}
      <div style={{ backgroundColor: '#F9FAFB', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>Official Government Database {isICTHead && '• ICT Administrative Access'}</h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.5rem 0' }}>Budget Office • Governor's Office Annex Uyo • Akwa Ibom State</p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>"The Land of Promise" - Official Records • Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Modals */}
      <Modal isOpen={showCreateStaff} onClose={() => setShowCreateStaff(false)} title="Create New Government Staff Record" size="xl">
        <CreateStaffForm onSubmit={(data) => handleCRUD('create', data)} onCancel={() => setShowCreateStaff(false)} />
      </Modal>
      {selectedStaff && (
        <Modal isOpen={showEditStaff} onClose={() => { setShowEditStaff(false); setSelectedStaff(null); }} title="Edit Government Staff Record" size="xl">
          <CreateStaffForm onSubmit={(data) => handleCRUD('update', data)} onCancel={() => { setShowEditStaff(false); setSelectedStaff(null); }} />
        </Modal>
      )}
    </div>
  );
};

export default GovernmentDatabaseTab;