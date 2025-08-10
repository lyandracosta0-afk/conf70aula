import React from 'react';
import { ArrowRight, CheckCircle, Cake, Users, ShoppingBag, BarChart3 } from 'lucide-react';

const Landing: React.FC = () => {
  const handleGetStarted = () => {
    window.open('https://buy.stripe.com/test_dRmeVcfyGeKJ6np0lEefC03', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Cake className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Confeitaria 7.0</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-amber-600 transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-amber-600 transition-colors">
                Preços
              </a>
              <a href="/login" className="text-gray-700 hover:text-amber-600 transition-colors">
                Entrar
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gerencie sua
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">
                {' '}Confeitaria{' '}
              </span>
              com Inteligência
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              O sistema completo para confeiteiros modernos. Controle pedidos, clientes e produtos 
              em uma plataforma intuitiva e poderosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-amber-600 to-rose-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-amber-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="/login"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-amber-600 hover:text-amber-600 transition-colors"
              >
                Ver Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para crescer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais desenvolvidas especialmente para confeiteiros
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-amber-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestão de Pedidos</h3>
              <p className="text-gray-600 mb-4">
                Controle total sobre seus pedidos, desde a criação até a entrega.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                  Status em tempo real
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                  Data de entrega
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                  Notas personalizadas
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-rose-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Controle de Clientes</h3>
              <p className="text-gray-600 mb-4">
                Mantenha todos os dados dos seus clientes organizados e acessíveis.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-rose-600 mr-2" />
                  Informações completas
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-rose-600 mr-2" />
                  Histórico de pedidos
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-rose-600 mr-2" />
                  Dados de contato
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Cake className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Catálogo de Produtos</h3>
              <p className="text-gray-600 mb-4">
                Organize seu cardápio e controle o estoque de forma inteligente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Categorias personalizadas
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Controle de estoque
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Preços dinâmicos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Plano Simples e Transparente
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa em um único plano
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
              <div className="bg-gradient-to-r from-amber-600 to-rose-600 px-6 py-8">
                <h3 className="text-2xl font-bold text-white text-center">Plano Profissional</h3>
                <div className="text-center mt-4">
                  <span className="text-5xl font-bold text-white">R$19,90</span>
                  <span className="text-xl text-amber-100">/mês</span>
                </div>
              </div>
              
              <div className="px-6 py-8">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Pedidos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Clientes ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Produtos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Suporte por email</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Atualizações gratuitas</span>
                  </li>
                </ul>

                <button
                  onClick={handleGetStarted}
                  className="w-full mt-8 bg-gradient-to-r from-amber-600 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Começar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Cake className="h-8 w-8 text-amber-600 mr-3" />
              <span className="text-2xl font-bold">Confeitaria 7.0</span>
            </div>
            <div className="text-gray-400">
              © 2025 Confeitaria 7.0. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;