// src/components/pages/LoginPage.tsx
// Beautiful Login page matching homepage design for Akwa Ibom State Budget Office

import React from 'react';
import SignInForm from '../auth/SignInForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header matching homepage style */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-green-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Staff Access Portal
            </h1>
            <p className="text-orange-100 text-lg">
              Akwa Ibom State Budget Office • Database Management System
            </p>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Main Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Card Header with Logo */}
            <div className="bg-gradient-to-r from-green-600 to-orange-600 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="/src/assets/images/akwa-ibom-state-logo.jpg" 
                  alt="Akwa Ibom State Logo" 
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = target.nextElementSibling as HTMLElement;
                    target.style.display = 'none';
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-16 h-16 bg-green-100 rounded-full items-center justify-center text-green-600 font-bold text-xl hidden">
                  AK
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Budget Office
              </h2>
              <p className="text-green-100 text-sm">
                Enter your credentials to access the system
              </p>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <SignInForm />
            </div>

            {/* Card Footer with Account Info */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-6 border-t">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Government Access Portal</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between items-center py-1 px-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-green-700">Director:</span>
                    <span>director@aksgov.ng</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-orange-700">ICT Head:</span>
                    <span>ict@aksgov.ng</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                  Contact your administrator for access credentials
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            {/* Services Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-green-600 text-xs">📊</span>
                </div>
                Budget Office Services
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• State Budget Planning & Analysis</li>
                <li>• Financial Resource Allocation</li>
                <li>• Budget Implementation Monitoring</li>
                <li>• Staff Database Management</li>
                <li>• Performance Tracking & Reporting</li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-orange-600 text-sm">🔒</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 text-sm mb-1">Secure Government Portal</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This system is restricted to authorized government personnel only. 
                    All activities are monitored and logged for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching homepage */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-2">
            © 2025 Akwa Ibom State Government - Budget Office Database Management System
          </p>
          <p className="text-xs text-gray-400">
            "The Land of Promise" - Secure • Efficient • Transparent
          </p>
          <div className="flex justify-center items-center mt-3 space-x-4 text-xs text-gray-300">
            <span>🏛️ Government Portal</span>
            <span>•</span>
            <span>🔐 Secure Access</span>
            <span>•</span>
            <span>📊 Data Management</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;