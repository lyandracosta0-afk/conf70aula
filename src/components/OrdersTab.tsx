import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Eye, Edit, Trash2, Calendar, DollarSign, User } from 'lucide-react';
import OrderModal from './OrderModal';

interface Order {
  id: string;
  customer_id: string;
  status: string;
  total: number;
  delivery_date: string;
  notes: string;
  created_at: string;
  customers: {
    name: string;
    email: string;
  };
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
    };
  }>;
}

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name, email),
          order_items (
            id,
            quantity,
            price,
            products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-semibold text-gray-900">Pedidos</h2>
        <button
          onClick={() => {
            setSelectedOrder(null);
            setIsModalOpen(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Pedido</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum pedido encontrado</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Criar primeiro pedido
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id.slice(0, 8)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{order.customers?.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">R$ {Number(order.total).toFixed(2)}</span>
                      </div>
                      
                      {order.delivery_date && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(order.delivery_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>

                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Itens:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.order_items.map((item) => (
                            <span key={item.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {item.quantity}x {item.products?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Observações:</span> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onSave={() => {
            fetchOrders();
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrdersTab;