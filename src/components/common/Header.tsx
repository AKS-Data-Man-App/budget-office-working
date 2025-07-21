// src/components/common/Header.tsx
import React from 'react';
import { ArrowLeft, LogOut, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick
}) => {
  const { state, signOut } = useAppContext();
  const currentUser = state.user;
  const handleSignOut = signOut;

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-600 via-green-700 to-orange-600 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-green-100 text-sm">{subtitle}</p>
              )}
            </div>
          </div>

          {/* User Info & Actions */}
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-green-100">{currentUser.office}</p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;