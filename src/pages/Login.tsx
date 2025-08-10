import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Cake, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
        // After signup, user will need to verify subscription
        navigate('/dashboard');
      } else {
        await signIn(email, password);
        // Subscription check happens automatically in AuthContext
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center mb-8">
            <Cake className="h-12 w-12 text-amber-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Confeitaria 7.0</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">
            {isSignUp ? 'Criar conta' : 'Entrar na sua conta'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp 
              ? 'Comece a gerenciar sua confeitaria hoje mesmo'
              : 'Acesse seu painel de controle'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder={isSignUp ? 'Mínimo 6 caracteres' : 'Sua senha'}
                  minLength={isSignUp ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-rose-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </div>
              ) : (
                isSignUp ? 'Criar conta' : 'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              {isSignUp 
                ? 'Já tem uma conta? Entrar'
                : 'Não tem uma conta? Criar conta'
              }
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;