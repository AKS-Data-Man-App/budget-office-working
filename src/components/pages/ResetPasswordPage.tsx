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

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Reset Link</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Updated!</h2>
        <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800"><strong>Email:</strong> {userInfo?.email}</p>
        </div>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    </div>
  );

  const ErrorScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </div>
    </div>
  );

  if (validatingToken) return <LoadingScreen />;
  if (success) return <SuccessScreen />;
  if (!tokenValid) return <ErrorScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Set Your Password</h1>
          <p className="text-gray-600">Hello <strong>{userInfo?.firstName} {userInfo?.lastName}</strong>, create a secure password.</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800"><strong>Email:</strong> {userInfo?.email}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Enter your new password"
              />
              <button type="button" onClick={() => togglePassword('new')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Confirm your new password"
              />
              <button type="button" onClick={() => togglePassword('confirm')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                At least 8 characters
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Upper & lowercase letters
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                At least one number
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Setting Password...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Set Password
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/login'}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;