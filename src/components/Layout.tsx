import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, CheckCircle, AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut, hasActiveSubscription, subscriptionLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-600">Confeitaria 7.0</h1>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                {!subscriptionLoading && (
                  <div className="flex items-center space-x-2">
                    {hasActiveSubscription ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Assinatura Ativa</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">Sem Assinatura</span>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;