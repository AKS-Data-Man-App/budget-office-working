// src/components/auth/SignInForm.tsx

import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SignInFormData } from '../../types/auth.types';

const SignInForm: React.FC = () => {
  const { signIn, state } = useAppContext();
  
  const [formData, setFormData] = useState<SignInFormData>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    const success = await signIn(formData);
    
    if (success) {
      // Form will be reset by successful navigation
      setFormData({ username: '', password: '' });
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'officer') => {
    if (type === 'admin') {
      setFormData({
        username: 'admin',
        password: 'password123'
      });
    } else {
      setFormData({
        username: 'budget.officer',
        password: 'budget2024'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {state.error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700 text-sm">{state.error}</span>
        </div>
      )}

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your username"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={state.isLoading || !formData.username.trim() || !formData.password.trim()}
        className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-orange-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {state.isLoading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing In...
          </div>
        ) : (
          <div className="flex items-center">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </div>
        )}
      </button>

      {/* Demo Credential Buttons */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Admin Demo
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('officer')}
            className="px-3 py-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            Officer Demo
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;