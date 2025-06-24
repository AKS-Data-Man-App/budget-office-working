// src/components/pages/BudgetOfficePage.tsx

import React from 'react';
import { ArrowLeft, Building2, Users, Shield } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SignInForm from '../auth/SignInForm';

const BudgetOfficePage: React.FC = () => {
  const { setCurrentPage, isSignedIn } = useAppContext();

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // If user is already signed in, navigate to database
  React.useEffect(() => {
    if (isSignedIn) {
      setCurrentPage('database');
    }
  }, [isSignedIn, setCurrentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-white to-green-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={handleBackToHome}
              className="mr-4 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors shadow-md"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                The Budget Office Building
              </h1>
              <p className="text-lg text-gray-700 mt-1">
                Akwa Ibom State Government Complex
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Large Building Image Display */}
        <div className="mb-12">
          <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-orange-200">
            {/* Building Image Recreation based on Image 2 */}
            <div className="h-96 md:h-[500px] bg-gradient-to-b from-blue-100 to-blue-50 relative overflow-hidden">
              {/* Sky and Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-green-100">
                {/* Clouds */}
                <div className="absolute top-10 left-20 w-16 h-8 bg-white/60 rounded-full"></div>
                <div className="absolute top-16 right-32 w-20 h-6 bg-white/50 rounded-full"></div>
                <div className="absolute top-8 right-16 w-12 h-6 bg-white/40 rounded-full"></div>
              </div>

              {/* Government Building */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-64">
                {/* Main Building Structure */}
                <div className="relative w-full h-full">
                  {/* Building Base */}
                  <div className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-lg shadow-xl">
                    
                    {/* Roof */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-full h-16">
                      <div className="w-full h-full bg-gradient-to-b from-red-800 to-red-900 rounded-t-lg relative overflow-hidden">
                        {/* Roof Details */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-red-700 rounded"></div>
                      </div>
                    </div>

                    {/* Government Emblem on Building */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>

                    {/* Columns */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-0 bg-white shadow-md"
                        style={{
                          left: `${15 + i * 12}%`,
                          width: '8%',
                          height: '70%'
                        }}
                      >
                        <div className="w-full h-2 bg-gray-300 rounded-t"></div>
                      </div>
                    ))}

                    {/* Windows */}
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-3/4 grid grid-cols-4 gap-2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-full h-4 bg-blue-200 border border-gray-400 rounded-sm"></div>
                      ))}
                    </div>
                  </div>

                  {/* Flag Poles */}
                  <div className="absolute bottom-48 left-8 w-1 h-20 bg-gray-600"></div>
                  <div className="absolute bottom-48 right-8 w-1 h-20 bg-gray-600"></div>
                  
                  {/* Nigerian Flag */}
                  <div className="absolute bottom-60 left-8 w-8 h-6 bg-green-600"></div>
                  <div className="absolute bottom-60 left-12 w-8 h-6 bg-white"></div>
                  <div className="absolute bottom-60 left-16 w-8 h-6 bg-green-600"></div>
                  
                  {/* Akwa Ibom Flag */}
                  <div className="absolute bottom-60 right-16 w-8 h-6 bg-orange-500"></div>
                  <div className="absolute bottom-60 right-12 w-8 h-6 bg-white"></div>
                  <div className="absolute bottom-60 right-8 w-8 h-6 bg-green-600"></div>
                </div>
              </div>

              {/* Ground/Landscape */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-300 to-green-200"></div>
              
              {/* Trees/Vegetation */}
              <div className="absolute bottom-16 left-10 w-8 h-12 bg-green-700 rounded-full"></div>
              <div className="absolute bottom-16 right-10 w-8 h-12 bg-green-700 rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-6 h-8 bg-green-600 rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-6 h-8 bg-green-600 rounded-full"></div>
            </div>

            {/* Building Information */}
            <div className="p-6 bg-gradient-to-r from-orange-50 to-green-50 border-t-4 border-orange-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Budget Office Complex
                </h2>
                <p className="text-gray-600 mb-4">
                  Government House Complex, Uyo • Akwa Ibom State
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span>Administrative Headquarters</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Budget Planning & Implementation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Section */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-orange-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Staff Access Portal
              </h3>
              <p className="text-gray-600">
                Enter your credentials to access the Budget Office database and management system
              </p>
            </div>

            <SignInForm />

            {/* Office Information */}
            <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-200">
              <h4 className="text-sm font-semibold text-orange-800 mb-2 text-center">
                Budget Office Services
              </h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• State Budget Planning & Analysis</li>
                <li>• Financial Resource Allocation</li>
                <li>• Budget Implementation Monitoring</li>
                <li>• Staff Database Management</li>
                <li>• Performance Tracking & Reporting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer with State Colors */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-6 h-2 bg-orange-500 rounded"></div>
            <div className="w-6 h-2 bg-white border border-gray-300 rounded"></div>
            <div className="w-6 h-2 bg-green-500 rounded"></div>
          </div>
          <p className="text-sm text-gray-600">
            Akwa Ibom State Government • Digital Administration System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            "The Land of Promise" • Progressive Governance Through Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetOfficePage;