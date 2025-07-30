import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  expiresAt: string;
}

const ResetPasswordPage = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. No token provided.');
      setValidatingToken(false);
      return;
    }
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`https://budget-office-backend.onrender.com/api/v1/users/validate-reset-token/${token}`);
      const data = await response.json();
      if (data.success) {
        setTokenValid(true);
        setUserInfo(data.data);
      } else {
        setError('This reset link is invalid or has expired.');
      }
    } catch {
      setError('Failed to validate reset link.');
    }
    setValidatingToken(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData;
    if (!newPassword || !confirmPassword) return setError('Please fill in all fields'), false;
    if (newPassword.length < 8) return setError('Password must be at least 8 characters long'), false;
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) return setError('Password must contain uppercase, lowercase, and number'), false;
    if (newPassword !== confirmPassword) return setError('Passwords do not match'), false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://budget-office-backend.onrender.com/api/v1/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => window.location.href = '/login', 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch {
      setError('Failed to reset password. Please try again.');
    }
    setLoading(false);
  };

  const togglePassword = (field: 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // CSS Styles
  const styles = {
    pageBackground: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #F0FDF4 100%)'
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      minHeight: '100vh'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      maxWidth: '28rem',
      width: '100%',
      border: '1px solid #F3F4F6'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    iconContainer: {
      width: '4rem',
      height: '4rem',
      background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem auto'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold' as const,
      color: '#1F2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '0.875rem'
    },
    userInfoCard: {
      background: 'linear-gradient(135deg, #F0FDF4 0%, #FFF7ED 100%)',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      border: '1px solid #FED7AA'
    },
    inputGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500' as const,
      color: '#374151',
      marginBottom: '0.5rem'
    },
    inputContainer: {
      position: 'relative' as const
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingRight: '3rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box' as const
    },
    eyeButton: {
      position: 'absolute' as const,
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#9CA3AF',
      cursor: 'pointer'
    },
    requirementsCard: {
      background: 'linear-gradient(135deg, #F9FAFB 0%, #FFF7ED 100%)',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      border: '1px solid #E5E7EB'
    },
    requirementItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.25rem'
    },
    dot: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%'
    },
    errorCard: {
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '1.5rem'
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
      color: 'white',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      fontWeight: '500' as const,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      transition: 'transform 0.2s ease'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#6B7280',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      margin: '1rem auto 0 auto'
    },
    spinner: {
      width: '1rem',
      height: '1rem',
      border: '2px solid white',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const LoadingScreen = () => (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={{...styles.iconContainer, animation: 'spin 1s linear infinite'}}>
              <div style={styles.spinner}></div>
            </div>
            <h2 style={styles.title}>Validating Reset Link</h2>
            <p style={styles.subtitle}>Please wait while we verify your request...</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={{...styles.iconContainer, backgroundColor: '#F0FDF4'}}>
              <CheckCircle style={{ width: '2rem', height: '2rem', color: 'var(--akwa-green)' }} />
            </div>
            <h2 style={styles.title}>Password Updated!</h2>
            <p style={styles.subtitle}>Your password has been set successfully.</p>
          </div>
          
          <div style={styles.userInfoCard}>
            <h4 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
              Welcome, {userInfo?.firstName} {userInfo?.lastName}!
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> {userInfo?.email}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', fontStyle: 'italic' }}>
              You can now access the Budget Office system.
            </p>
          </div>

          <div style={{
            backgroundColor: '#F0FDF4',
            borderRadius: '0.75rem',
            padding: '1rem',
            textAlign: 'center' as const
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--akwa-green)', fontWeight: '500' }}>
              🎉 Account Setup Complete
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorScreen = () => (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={{...styles.iconContainer, backgroundColor: '#FEF2F2'}}>
              <AlertCircle style={{ width: '2rem', height: '2rem', color: '#EF4444' }} />
            </div>
            <h2 style={styles.title}>Invalid Reset Link</h2>
            <p style={{...styles.subtitle, marginBottom: '2rem', lineHeight: '1.5'}}>{error}</p>
          </div>
          
          <button
            onClick={() => window.location.href = '/login'}
            style={styles.submitButton}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );

  if (validatingToken) return <LoadingScreen />;
  if (success) return <SuccessScreen />;
  if (!tokenValid) return <ErrorScreen />;

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <Lock style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </div>
            <h1 style={styles.title}>Set Your Password</h1>
            <p style={styles.subtitle}>
              Hello <strong>{userInfo?.firstName} {userInfo?.lastName}</strong>, create your secure password.
            </p>
          </div>

          {/* User Info */}
          <div style={styles.userInfoCard}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
              <strong style={{ color: '#1F2937' }}>Email:</strong> {userInfo?.email}
            </p>
          </div>

          {/* Password Form */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your new password"
                onFocus={(e) => e.target.style.borderColor = 'var(--akwa-green)'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
              <button type="button" onClick={() => togglePassword('new')} style={styles.eyeButton}>
                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputContainer}>
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Confirm your new password"
                onFocus={(e) => e.target.style.borderColor = 'var(--akwa-green)'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
              <button type="button" onClick={() => togglePassword('confirm')} style={styles.eyeButton}>
                {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div style={styles.requirementsCard}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
              Password Requirements:
            </h4>
            <div style={styles.requirementItem}>
              <div style={{
                ...styles.dot,
                backgroundColor: formData.newPassword.length >= 8 ? 'var(--akwa-green)' : '#D1D5DB'
              }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>At least 8 characters</span>
            </div>
            <div style={styles.requirementItem}>
              <div style={{
                ...styles.dot,
                backgroundColor: /(?=.*[a-z])(?=.*[A-Z])/.test(formData.newPassword) ? 'var(--akwa-green)' : '#D1D5DB'
              }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Upper & lowercase letters</span>
            </div>
            <div style={styles.requirementItem}>
              <div style={{
                ...styles.dot,
                backgroundColor: /(?=.*\d)/.test(formData.newPassword) ? 'var(--akwa-green)' : '#D1D5DB'
              }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>At least one number</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle style={{ width: '1rem', height: '1rem', color: '#EF4444' }} />
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...styles.submitButton,
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, var(--akwa-green) 0%, var(--akwa-orange) 100%)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Setting Password...
              </>
            ) : (
              <>
                <Lock size={16} />
                Set My Password
              </>
            )}
          </button>

          {/* Back to Login */}
          <button
            onClick={() => window.location.href = '/login'}
            style={styles.backButton}
            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            <ArrowLeft size={12} />
            Back to Login
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        :root {
          --akwa-green: #16a34a;
          --akwa-orange: #ea580c;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;