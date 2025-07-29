// src/components/pages/DirectorDashboard/components/GovernmentDatabaseTab.tsx
// Clean Government Database Tab with Full CRUD

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
  const { state, loadNominalRoll, dispatch } = useAppContext();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [lgaFilter, setLgaFilter] = useState('all');
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isICTHead = state.user?.role === 'ICT_HEAD';

  // Get full staff record with ID for CRUD operations
  const getFullStaffRecord = async (nominalStaff: any) => {
    try {
      console.log('🔍 Finding full record for:', nominalStaff);
      const response = await apiCall('/api/v1/staff');
      const fullStaffList = response.data;
      console.log('📋 Full staff list:', fullStaffList);
      
      // Try multiple matching strategies
      const nominalName = nominalStaff.nameOfOfficer || `${nominalStaff.firstName || ''} ${nominalStaff.lastName || ''}`.trim();
      console.log('🎯 Searching for name:', nominalName);
      
      const match = fullStaffList.find((s: any) => {
        const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim();
        console.log('🔍 Comparing:', nominalName, 'vs', fullName);
        
        return (
          // Match by employee ID
          (s.employeeId && nominalStaff.employeeId && s.employeeId === nominalStaff.employeeId) ||
          // Match by serial number
          (s.sn && nominalStaff.sn && s.sn.toString() === nominalStaff.sn.toString()) ||
          // Match by full name (case insensitive)
          (nominalName.toLowerCase() === fullName.toLowerCase()) ||
          // Match by partial name
          (nominalName.toLowerCase().includes(s.firstName?.toLowerCase() || '') && 
           nominalName.toLowerCase().includes(s.lastName?.toLowerCase() || ''))
        );
      });
      
      console.log('✅ Found match:', match);
      return match;
    } catch (error) {
      console.error('Failed to get full staff record:', error);
      return null;
    }
  };

  // Filter and process data
  const { filteredStaff, departments, lgas, stats } = useMemo(() => {
    const data = state.staffData || [];
    const filtered = data.filter((staff: any) => {
      const name = staff.nameOfOfficer || `${staff.firstName || ''} ${staff.lastName || ''}`.trim();
      const dept = staff.department?.name || staff.department || '';
      const searchMatch = !search || `${name} ${staff.rank} ${dept} ${staff.lga}`.toLowerCase().includes(search.toLowerCase());
      const deptMatch = departmentFilter === 'all' || dept === departmentFilter;
      const lgaMatch = lgaFilter === 'all' || staff.lga === lgaFilter;
      return searchMatch && deptMatch && lgaMatch;
    });
    
    const departments = Array.from(new Set(data.map((s: any) => s.department?.name || s.department).filter(Boolean))).sort();
    const lgas = Array.from(new Set(data.map((s: any) => s.lga).filter(Boolean))).sort();
    const stats = [
      { label: 'Total Staff', value: data.length, color: '#374151', icon: '👥' },
      { label: 'Departments', value: departments.length, color: 'var(--akwa-green)', icon: '🏢' },
      { label: 'LGAs', value: lgas.length, color: 'var(--akwa-orange)', icon: '🗺️' },
      { label: 'Active', value: filtered.length, color: '#22C55E', icon: '✅' }
    ];
    
    return { filteredStaff: filtered, departments, lgas, stats };
  }, [state.staffData, search, departmentFilter, lgaFilter]);

  // API Helper
  const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
    const token = localStorage.getItem('token');
    const config: RequestInit = {
      method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      ...(data && method !== 'GET' && { body: JSON.stringify(data) })
    };
    const response = await fetch(`https://budget-office-backend.onrender.com${endpoint}`, config);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  };

  // Transform data for API
  const transformData = (staffData: any) => ({
    employeeId: staffData.employeeId || `AKS${Date.now()}`,
    firstName: staffData.firstName, lastName: staffData.lastName, sex: staffData.sex,
    dateOfBirth: staffData.dateOfBirth ? new Date(staffData.dateOfBirth).toISOString() : null,
    dateOfFirstAppointment: staffData.dateOfFirstAppointment ? new Date(staffData.dateOfFirstAppointment).toISOString() : null,
    dateOfConfirmation: staffData.dateOfConfirmation ? new Date(staffData.dateOfConfirmation).toISOString() : null,
    dateOfLastPromotion: staffData.dateOfLastPromotion ? new Date(staffData.dateOfLastPromotion).toISOString() : null,
    rank: staffData.rank, gradeLevel: staffData.gradeLevel, step: staffData.step ? parseInt(staffData.step) : null,
    educationalQualification: staffData.educationalQualification, lga: staffData.lga, remarks: staffData.remarks,
    email: staffData.email, phoneNumber: staffData.phoneNumber, departmentId: staffData.departmentId
  });

  // CRUD Handler
  const handleCRUD = async (action: string, staffData?: any, staff?: any) => {
    if (!isICTHead && action !== 'view') {
      toast.error('Only ICT Head can modify staff records');
      return;
    }

    const loadingToast = ['create', 'update', 'delete'].includes(action) 
      ? toast.loading(`${action === 'create' ? 'Creating' : action === 'update' ? 'Updating' : 'Deleting'} staff...`)
      : null;

    try {
      setIsLoading(true);
      let result;

      switch (action) {
        case 'create':
          result = await apiCall('/api/v1/staff', 'POST', transformData(staffData));
          toast.success(`${staffData.firstName} ${staffData.lastName} created successfully!`, { id: loadingToast! });
          setShowCreateStaff(false);
          await loadNominalRoll();
          break;

        case 'update':
          const updateId = selectedStaff.id || selectedStaff.employeeId;
          if (!updateId) { toast.error('Staff ID not found', { id: loadingToast! }); return; }
          result = await apiCall(`/api/v1/staff/${updateId}`, 'PUT', transformData(staffData));
          toast.success(`${staffData.firstName} ${staffData.lastName} updated successfully!`, { id: loadingToast! });
          setShowEditStaff(false); setSelectedStaff(null);
          await loadNominalRoll();
          break;

        case 'delete':
          // Get full staff record first to get the database ID
          console.log('🗑️ Attempting to delete staff:', staff);
          const fullStaffRecord = await getFullStaffRecord(staff);
          const deleteId = fullStaffRecord?.id;
          
          if (!deleteId) { 
            console.error('❌ No database ID found for staff:', staff);
            console.error('❌ Full staff record:', fullStaffRecord);
            toast.error('Unable to locate staff record for deletion. Please try refreshing the page.'); 
            return; 
          }
          
          console.log('✅ Found database ID:', deleteId, 'for staff:', fullStaffRecord);
          
          toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 style={{ width: '1.5rem', height: '1.5rem', color: '#EF4444' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '1rem' }}>Delete Staff Member</div>
                  <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>This action cannot be undone</div>
                </div>
              </div>
              
              <div style={{ padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {staff.firstName || staff.nameOfOfficer} {staff.lastName}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  {staff.rank} • {staff.department?.name || staff.department}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    toast.dismiss(t.id);
                    const deleteToast = toast.loading('Deleting staff member...');
                    try {
                      await apiCall(`/api/v1/staff/${deleteId}`, 'DELETE');
                      toast.success(`${staff.firstName || staff.nameOfOfficer} ${staff.lastName} deleted successfully!`, { id: deleteToast });
                      await loadNominalRoll();
                    } catch (error) {
                      toast.error(`Failed to delete staff: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: deleteToast });
                    }
                  }}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '500' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ), {
            duration: Infinity, // Stay open until user decides
            position: 'top-center'
          });
          break;

        case 'view':
          const viewId = staff.id || staff.employeeId;
          if (!viewId) { toast.error('Staff ID not found'); return; }
          result = await apiCall(`/api/v1/staff/${viewId}`);
          const info = result.data;
          toast.success(`${info.firstName} ${info.lastName} - ${info.rank} - ${info.department?.name || 'N/A'}`, { duration: 8000 });
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action} staff: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: loadingToast! });
    } finally {
      setIsLoading(false);
    }
  };

  // Table columns - Complete government format (optimized widths for no scroll)
  const getGradeColor = (grade: string) => {
    const level = parseInt(grade?.replace('GL-', '') || '0');
    return level >= 17 ? 'danger' : level >= 15 ? 'warning' : level >= 12 ? 'primary' : 'info';
  };

  const columns: TableColumn[] = [
    { key: 'sn', header: 'S/N', width: '50px', render: (sn: number) => sn },
    {
      key: 'officer', header: 'Name of Officer', width: '150px',
      render: (_, staff: any) => (
        <div>
          <div style={{ fontWeight: '500', fontSize: '0.8rem' }}>{staff.firstName || staff.nameOfOfficer} {staff.lastName}</div>
          <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{staff.sex} • {staff.lga}</div>
        </div>
      )
    },
    { key: 'employeeId', header: 'Employee ID', width: '80px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.employeeId || staff.sn || 'N/A'}</div> },
    { key: 'rank', header: 'Rank', width: '140px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.rank || 'N/A'}</div> },
    {
      key: 'grade', header: 'Grade Level', width: '90px',
      render: (_, staff: any) => (
        <div>
          <Badge variant={getGradeColor(staff.gradeLevel)} size="sm">{staff.gradeLevel || 'N/A'}</Badge>
          <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Step {staff.step || 'N/A'}</div>
        </div>
      )
    },
    { key: 'dateOfBirth', header: 'Date of Birth', width: '90px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.dateOfBirth || 'N/A'}</div> },
    { key: 'dateOfFirstAppointment', header: 'First Appointment', width: '100px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.dateOfFirstAppointment || 'N/A'}</div> },
    { key: 'dateOfConfirmation', header: 'Confirmation', width: '90px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.dateOfConfirmation || 'N/A'}</div> },
    { key: 'dateOfLastPromotion', header: 'Last Promotion', width: '90px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.dateOfLastPromotion || 'N/A'}</div> },
    { key: 'educationalQualification', header: 'Education', width: '120px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }} title={staff.educationalQualification}>{staff.educationalQualification || 'N/A'}</div> },
    { key: 'dateOfRetirement', header: 'Retirement', width: '90px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.dateOfRetirement || 'N/A'}</div> },
    { key: 'department', header: 'Department', width: '110px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }}>{staff.department?.name || staff.department || 'N/A'}</div> },
    { key: 'remarks', header: 'Remarks', width: '100px', render: (_, staff: any) => <div style={{ fontSize: '0.8rem' }} title={staff.remarks}>{staff.remarks || 'N/A'}</div> }
  ];

  // Add actions for ICT Head
  if (isICTHead) {
    columns.push({
      key: 'actions', header: 'Actions', width: '150px',
      render: (_, staff: any) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleCRUD('view', null, staff)} style={{ padding: '0.25rem', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '0.25rem' }}>
            <Eye style={{ width: '0.875rem', height: '0.875rem' }} />
          </button>
          <button onClick={() => { setSelectedStaff(staff); setShowEditStaff(true); }} style={{ padding: '0.25rem', backgroundColor: 'var(--akwa-green)', color: 'white', border: 'none', borderRadius: '0.25rem' }}>
            <Edit style={{ width: '0.875rem', height: '0.875rem' }} />
          </button>
          <button onClick={() => handleCRUD('delete', null, staff)} style={{ padding: '0.25rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.25rem' }}>
            <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
          </button>
        </div>
      )
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
            STAFF NOMINAL ROLL OF STATE BUDGET OFFICE
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Governor's Office Annex Uyo - July 2025 • Akwa Ibom State - "The Land of Promise"
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isICTHead && (
            <Button variant="gradient" size="md" icon={<UserPlus />} onClick={() => setShowCreateStaff(true)} disabled={isLoading}>
              Create New Staff
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
          <input type="text" placeholder="Search by name, rank, department..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
        </div>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '150px' }}>
          <option value="all">All Departments</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
        <select value={lgaFilter} onChange={(e) => setLgaFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', minWidth: '120px' }}>
          <option value="all">All LGAs</option>
          {lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
        </select>
        <Button variant="success" size="sm" icon={<Download />} onClick={() => toast.promise(new Promise(resolve => setTimeout(() => resolve(`${filteredStaff.length} records exported`), 2000)), { loading: 'Exporting...', success: (msg) => `${msg} successfully!`, error: 'Export failed' })}>
          Export
        </Button>
        {(search || departmentFilter !== 'all' || lgaFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDepartmentFilter('all'); setLgaFilter('all'); }}>Clear</Button>
        )}
      </div>

      {/* Results */}
      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
        Showing {filteredStaff.length} of {state.staffData?.length || 0} government employees
        {isICTHead && <span style={{ marginLeft: '1rem', color: 'var(--akwa-green)', fontWeight: '500' }}>• Full database access enabled</span>}
      </div>

      {/* Table - Full width, no scroll - REMOVED style prop */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <Table 
          columns={columns} 
          data={filteredStaff} 
          keyField="sn" 
          loading={state.isLoading || isLoading} 
          emptyMessage="No staff records found" 
          size="sm"
        />
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#F9FAFB', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
          Official Government Database {isICTHead && '• ICT Administrative Access'}
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 0.5rem 0' }}>
          Budget Office • Governor's Office Annex Uyo • Akwa Ibom State
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
          "The Land of Promise" - Last updated: {new Date().toLocaleDateString()}
        </p>
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