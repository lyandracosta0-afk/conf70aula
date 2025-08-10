import React, { useState } from 'react';
import Layout from '../components/Layout';
import OrdersTab from '../components/OrdersTab';
import CustomersTab from '../components/CustomersTab';
import ProductsTab from '../components/ProductsTab';
import { ShoppingBag, Users, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'orders' | 'customers' | 'products';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const { checkSubscription, subscriptionLoading } = useAuth();

  const tabs = [
    { id: 'orders', name: 'Pedidos', icon: ShoppingBag },
    { id: 'customers', name: 'Clientes', icon: Users },
    { id: 'products', name: 'Produtos', icon: Package },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab />;
      case 'customers':
        return <CustomersTab />;
      case 'products':
        return <ProductsTab />;
      default:
        return <OrdersTab />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Gerencie sua confeitaria de forma eficiente</p>
            </div>
            <button
              onClick={checkSubscription}
              disabled={subscriptionLoading}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Verificar status da assinatura"
            >
              <RefreshCw className={`h-4 w-4 ${subscriptionLoading ? 'animate-spin' : ''}`} />
              <span>Verificar Assinatura</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </Layout>
  );
};

export default Dashboard;