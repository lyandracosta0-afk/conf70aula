import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Users } from 'lucide-react';
import CustomerModal from './CustomerModal';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const CustomersTab: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Clientes</h2>
        <button
          onClick={() => {
            setSelectedCustomer(null);
            setIsModalOpen(true);
          }}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum cliente encontrado</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Adicionar primeiro cliente
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {customer.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                )}
                
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                )}
                
                {customer.address && (
                  <div className="flex items-start space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Cadastrado em {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={() => {
            fetchCustomers();
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomersTab;