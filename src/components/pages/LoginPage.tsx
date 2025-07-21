// src/components/pages/LoginPage.tsx
// Login page for Akwa Ibom State Budget Office 3-Tier Authentication

import React from 'react';
import SignInForm from '../auth/SignInForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/src/assets/images/akwa-ibom-state-logo.jpg" 
              alt="Akwa Ibom State Logo" 
              className="h-16 w-16 mx-auto rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Budget Office
            </h1>
            <p className="text-gray-600 text-sm">
              Database Management System
            </p>
            <p className="text-green-600 text-xs font-medium mt-1">
              Akwa Ibom State Government
            </p>
          </div>

          {/* Sign In Form */}
          <SignInForm />

          {/* Demo Accounts Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Available Accounts:</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Director:</strong> director@aksgov.ng</p>
              <p><strong>ICT Head:</strong> ict@aksgov.ng</p>
              <p className="text-xs text-gray-500 mt-2">
                Contact your administrator for login credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Akwa Ibom State - "The Land of Promise"
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Secure • Efficient • Transparent
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;