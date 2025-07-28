// src/components/pages/DirectorDashboard/components/CreateStaffForm.tsx
// Staff Creation Form - Compact and Essential

import React, { useState } from 'react';
import { User, Save, X } from 'lucide-react';
import Button from '../../../common/Button';

interface CreateStaffFormProps {
  onSubmit: (staffData: any) => void;
  onCancel: () => void;
}

const CreateStaffForm: React.FC<CreateStaffFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameOfOfficer: '', sex: '', dateOfBirth: '', dateOfFirstAppointment: '',
    dateOfConfirmation: '', dateOfLastPromotion: '', rank: '', gradeLevel: '',
    step: 1, educationalQualification: '', lga: '', department: '', remarks: ''
  });

  // Data arrays
  const lgas = ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'];
  const departments = ['Administration Department', 'Audit Department', 'Budget Department', 'Finance Department', 'Human Resources', 'ICT Department', 'Legal Department', 'Planning Department', 'Procurement Department', 'Public Relations'];
  const grades = ['GL-01', 'GL-02', 'GL-03', 'GL-04', 'GL-05', 'GL-06', 'GL-07', 'GL-08', 'GL-09', 'GL-10', 'GL-11', 'GL-12', 'GL-13', 'GL-14', 'GL-15', 'GL-16', 'GL-17'];
  const ranks = ['Administrative Officer', 'Senior Administrative Officer', 'Principal Administrative Officer', 'Assistant Director', 'Deputy Director', 'Director', 'Budget Analyst', 'Senior Budget Analyst', 'Principal Budget Analyst', 'Finance Officer', 'Senior Finance Officer', 'Finance Manager', 'Accountant', 'Senior Accountant', 'Chief Accountant', 'Planning Officer', 'Senior Planning Officer', 'ICT Officer', 'Senior ICT Officer', 'Audit Officer', 'Senior Audit Officer'];

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const birthDate = new Date(formData.dateOfBirth);
      const retirementDate = new Date(birthDate);
      retirementDate.setFullYear(birthDate.getFullYear() + 60);
      
      await onSubmit({
        ...formData,
        dateOfRetirement: retirementDate.toLocaleDateString('en-US'),
        step: Number(formData.step)
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.nameOfOfficer && formData.sex && formData.dateOfBirth && formData.dateOfFirstAppointment && formData.rank && formData.gradeLevel && formData.department && formData.lga;

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
              <label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="text" value={formData.nameOfOfficer} onChange={(e) => handleChange('nameOfOfficer', e.target.value)} placeholder="e.g., Emem Grace Ekerete" required style={inputStyle} />
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
              <select value={formData.department} onChange={(e) => handleChange('department', e.target.value)} required style={{...inputStyle, backgroundColor: 'white'}}>
                <option value="">Select Department</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
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
              <input type="text" value={formData.educationalQualification} onChange={(e) => handleChange('educationalQualification', e.target.value)} placeholder="e.g., B.Sc Accounting, ACA" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Remarks</label>
              <textarea value={formData.remarks} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="e.g., Excellent performance record" rows={2} style={{...inputStyle, resize: 'vertical'}} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} icon={<X />}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" loading={loading} disabled={!isValid || loading} icon={<Save />}>
            Create Staff
          </Button>
        </div>

        {!isValid && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.375rem', padding: '0.75rem', fontSize: '0.875rem', color: '#B91C1C' }}>
            Required: Name, Sex, Birth Date, First Appointment, Rank, Grade Level, Department, and LGA
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateStaffForm;