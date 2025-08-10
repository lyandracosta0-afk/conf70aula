import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Package, DollarSign, Hash } from 'lucide-react';
import ProductModal from './ProductModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  created_at: string;
}

const ProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Bolos': 'bg-pink-100 text-pink-800',
      'Doces': 'bg-purple-100 text-purple-800',
      'Salgados': 'bg-orange-100 text-orange-800',
      'Bebidas': 'bg-blue-100 text-blue-800',
      'Outros': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-semibold text-gray-900">Produtos</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum produto encontrado</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Adicionar primeiro produto
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {product.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">R$ {Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Hash className="h-4 w-4" />
                    <span className="text-sm">{product.stock} em estoque</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Cadastrado em {new Date(product.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={() => {
            fetchProducts();
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsTab;