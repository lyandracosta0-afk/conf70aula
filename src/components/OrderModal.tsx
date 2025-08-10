import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Plus, Minus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_id: string;
  status: string;
  total: number;
  delivery_date: string;
  notes: string;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
  onSave: () => void;
}

const statuses = ['Pendente', 'Em andamento', 'Concluído', 'Cancelado'];

const OrderModal: React.FC<OrderModalProps> = ({ order, onClose, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: order?.customer_id || '',
    status: order?.status || 'Pendente',
    delivery_date: order?.delivery_date || '',
    notes: order?.notes || '',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    order?.order_items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })) || []
  );

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      if (order) {
        // Update existing order
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            ...formData,
            total,
          })
          .eq('id', order.id);

        if (orderError) throw orderError;

        // Delete existing order items
        await supabase
          .from('order_items')
          .delete()
          .eq('order_id', order.id);

        // Insert new order items
        if (orderItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
              orderItems.map(item => ({
                order_id: order.id,
                ...item,
              }))
            );

          if (itemsError) throw itemsError;
        }
      } else {
        // Create new order
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              ...formData,
              total,
              user_id: user.id,
            },
          ])
          .select()
          .single();

        if (orderError) throw orderError;

        // Insert order items
        if (orderItems.length > 0 && newOrder) {
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
              orderItems.map(item => ({
                order_id: newOrder.id,
                ...item,
              }))
            );

          if (itemsError) throw itemsError;
        }
      }

      onSave();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addOrderItem = () => {
    if (products.length > 0) {
      setOrderItems([...orderItems, {
        product_id: products[0].id,
        quantity: 1,
        price: products[0].price,
      }]);
    }
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-update price when product changes
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].price = product.price;
      }
    }
    
    setOrderItems(updatedItems);
  };

  const total = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <select
                id="customer_id"
                name="customer_id"
                required
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Selecione um cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Entrega
            </label>
            <input
              type="date"
              id="delivery_date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Itens do Pedido
              </label>
              <button
                type="button"
                onClick={addOrderItem}
                disabled={products.length === 0}
                className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar</span>
              </button>
            </div>

            {orderItems.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">Nenhum item adicionado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                    <div className="col-span-5">
                      <select
                        value={item.product_id}
                        onChange={(e) => updateOrderItem(index, 'product_id', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="Qtd"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="Preço"
                      />
                    </div>
                    
                    <div className="col-span-1 text-right">
                      <span className="text-sm font-medium">
                        R$ {(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-3 border-t border-gray-200">
                  <div className="text-lg font-semibold">
                    Total: R$ {total.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Observações sobre o pedido"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Salvando...' : order ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;