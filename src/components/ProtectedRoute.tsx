import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { AlertTriangle, CreditCard } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, hasActiveSubscription, subscriptionLoading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando assinatura...</p>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Assinatura Necessária
          </h2>
          
          <p className="text-gray-600 mb-6">
            Para acessar o dashboard, você precisa de uma assinatura ativa do Confeitaria 7.0.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://buy.stripe.com/test_dRmeVcfyGeKJ6np0lEefC03', '_blank')}
              className="w-full bg-gradient-to-r from-amber-600 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Assinar Agora - R$ 19,90/mês</span>
            </button>
            
            <Link
              to="/"
              className="block w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;