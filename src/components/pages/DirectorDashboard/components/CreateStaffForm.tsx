// src/components/pages/DirectorDashboard/components/CreateStaffForm.tsx
// Staff Creation Form - Backend API Integrated with Toast Notifications

import React, { useState, useEffect } from 'react';
import { User, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../common/Button';

interface CreateStaffFormProps {
  onSubmit: (staffData: any) => void;
  onCancel: () => void;
}

const CreateStaffForm: React.FC<CreateStaffFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    dateOfBirth: '',
    dateOfFirstAppointment: '',
    dateOfConfirmation: '',
    dateOfLastPromotion: '',
    rank: '',
    gradeLevel: '',
    step: 1,
    educationalQualification: '',
    lga: '',
    departmentId: '',
    remarks: '',
    email: '',
    phoneNumber: ''
  });

  // Load departments from backend
  useEffect(() => {
    const loadDepartments = async () => {
      const loadingToast = toast.loading('Loading departments...');
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://budget-office-backend.onrender.com/api/v1/departments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (result.success) {
          setDepartments(result.data);
          toast.success('Departments loaded successfully', { id: loadingToast });
        } else {
          throw new Error('Failed to load departments');
        }
      } catch (error) {
        console.error('Error loading departments:', error);
        toast.error('Failed to load departments. Using fallback data.', { id: loadingToast });
        
        // Fallback departments with proper IDs
        setDepartments([
          { id: 'dept_budget_001', name: 'Budget Department' },
          { id: 'dept_finance_001', name: 'Finance Department' },
          { id: 'dept_admin_001', name: 'Administration Department' },
          { id: 'dept_audit_001', name: 'Audit Department' },
          { id: 'dept_hr_001', name: 'Human Resources' },
          { id: 'dept_ict_001', name: 'ICT Department' },
          { id: 'dept_legal_001', name: 'Legal Department' },
          { id: 'dept_planning_001', name: 'Planning Department' },
          { id: 'dept_procurement_001', name: 'Procurement Department' },
          { id: 'dept_pr_001', name: 'Public Relations' }
        ]);
      }
    };
    loadDepartments();
  }, []);

  // Static data arrays
  const lgas = ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'];
  const grades = ['GL-01', 'GL-02', 'GL-03', 'GL-04', 'GL-05', 'GL-06', 'GL-07', 'GL-08', 'GL-09', 'GL-10', 'GL-11', 'GL-12', 'GL-13', 'GL-14', 'GL-15', 'GL-16', 'GL-17'];
  const ranks = ['Administrative Officer', 'Senior Administrative Officer', 'Principal Administrative Officer', 'Assistant Director', 'Deputy Director', 'Director', 'Budget Analyst', 'Senior Budget Analyst', 'Principal Budget Analyst', 'Finance Officer', 'Senior Finance Officer', 'Finance Manager', 'Accountant', 'Senior Accountant', 'Chief Accountant', 'Planning Officer', 'Senior Planning Officer', 'ICT Officer', 'Senior ICT Officer', 'Audit Officer', 'Senior Audit Officer'];

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Creating staff member...');
    
    try {
      // Generate employee ID
      const employeeId = `AKS${Date.now().toString().slice(-6)}`;
      
      // Transform data to match backend API format
      const apiData = {
        employeeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        sex: formData.sex,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        dateOfFirstAppointment: formData.dateOfFirstAppointment ? new Date(formData.dateOfFirstAppointment).toISOString() : null,
        dateOfConfirmation: formData.dateOfConfirmation ? new Date(formData.dateOfConfirmation).toISOString() : null,
        dateOfLastPromotion: formData.dateOfLastPromotion ? new Date(formData.dateOfLastPromotion).toISOString() : null,
        rank: formData.rank,
        gradeLevel: formData.gradeLevel,
        step: Number(formData.step),
        educationalQualification: formData.educationalQualification,
        lga: formData.lga,
        remarks: formData.remarks,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        departmentId: formData.departmentId
      };

      // Call the parent's onSubmit with transformed data
      await onSubmit(apiData);
      
      // Success toast
      toast.success(
        `Staff member ${formData.firstName} ${formData.lastName} created successfully!`,
        { 
          id: loadingToast,
          duration: 5000 
        }
      );

      // Reset form after successful creation
      setFormData({
        firstName: '',
        lastName: '',
        sex: '',
        dateOfBirth: '',
        dateOfFirstAppointment: '',
        dateOfConfirmation: '',
        dateOfLastPromotion: '',
        rank: '',
        gradeLevel: '',
        step: 1,
        educationalQualification: '',
        lga: '',
        departmentId: '',
        remarks: '',
        email: '',
        phoneNumber: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Error toast with specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to create staff member';
      toast.error(
        `Failed to create staff member. ${errorMessage}`,
        { 
          id: loadingToast,
          duration: 6000 
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const isValid = formData.firstName && formData.lastName && formData.sex && formData.dateOfBirth && 
                  formData.dateOfFirstAppointment && formData.rank && formData.gradeLevel && 
                  formData.departmentId && formData.lga && formData.email && formData.phoneNumber;

  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', fontSize: '0.875rem' };
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' };
  const sectionStyle = { backgroundColor: '#F9FAFB', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' };

  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Personal Information */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>
            👤 Personal Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>First Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => handleChange('firstName', e.target.value)} 
                placeholder="e.g., Emem" 
                required 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => handleChange('lastName', e.target.value)} 
                placeholder="e.g., Ekerete" 
                required 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Sex <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={formData.sex} onChange={(e) => handleChange('sex', e.target.value)} required style={{...inputStyle, backgroundColor: 'white'}}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date of Birth <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>LGA <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={formData.lga} onChange={(e) => handleChange('lga', e.target.value)} required style={{...inputStyle, backgroundColor: 'white'}}>
                <option value="">Select LGA</option>
                {lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>
            📞 Contact Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                placeholder="e.g., emem.ekerete@aksgov.ng" 
                required 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
              <input 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={(e) => handleChange('phoneNumber', e.target.value)} 
                placeholder="e.g., +2348000000000" 
                required 
                style={inputStyle} 
              />
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>
            📅 Service Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>First Appointment <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="date" value={formData.dateOfFirstAppointment} onChange={(e) => handleChange('dateOfFirstAppointment', e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date of Confirmation</label>
              <input type="date" value={formData.dateOfConfirmation} onChange={(e) => handleChange('dateOfConfirmation', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Promotion</label>
              <input type="date" value={formData.dateOfLastPromotion} onChange={(e) => handleChange('dateOfLastPromotion', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Position Information */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>
            🏢 Position & Department
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Rank/Position <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={formData.rank} onChange={(e) => handleChange('rank', e.target.value)} required style={{...inputStyle, backgroundColor: 'white'}}>
                <option value="">Select Position</option>
                {ranks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Department <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={formData.departmentId} onChange={(e) => handleChange('departmentId', e.target.value)} required style={{...inputStyle, backgroundColor: 'white'}}>
                <option value="">Select Department</option>
                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Grade Level <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={formData.gradeLevel} onChange={(e) => handleChange('gradeLevel', e.target.value)} required style={{...inputStyle, backgroundColor: 'white'}}>
                <option value="">Select Grade</option>
                {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Step</label>
              <select value={formData.step} onChange={(e) => handleChange('step', Number(e.target.value))} style={{...inputStyle, backgroundColor: 'white'}}>
                {Array.from({length: 15}, (_, i) => i + 1).map(step => <option key={step} value={step}>Step {step}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Education & Additional */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>
            🎓 Education & Additional
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Educational Qualification</label>
              <input 
                type="text" 
                value={formData.educationalQualification} 
                onChange={(e) => handleChange('educationalQualification', e.target.value)} 
                placeholder="e.g., B.Sc Accounting, ACA" 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Remarks</label>
              <textarea 
                value={formData.remarks} 
                onChange={(e) => handleChange('remarks', e.target.value)} 
                placeholder="e.g., Excellent performance record" 
                rows={2} 
                style={{...inputStyle, resize: 'vertical'}} 
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} icon={<X />}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" loading={loading} disabled={!isValid || loading} icon={<Save />}>
            {loading ? 'Creating...' : 'Create Staff'}
          </Button>
        </div>

        {/* Validation Message */}
        {!isValid && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.375rem', padding: '0.75rem', fontSize: '0.875rem', color: '#B91C1C' }}>
            Required: First Name, Last Name, Sex, Birth Date, First Appointment, Rank, Grade Level, Department, LGA, Email, and Phone Number
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateStaffForm;