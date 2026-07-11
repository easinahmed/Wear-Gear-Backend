import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  description: string;
  category: string;
  images: string[];
  features: string[];
  stock: number;
  createdAt: string;
}

const emptyForm = {
  name: '', price: 0, originalPrice: 0, discountBadge: '',
  description: '', category: '', images: '', features: '', stock: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api.get<Product[]>('/products')
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      discountBadge: product.discountBadge || '',
      description: product.description,
      category: product.category,
      images: product.images.join('\n'),
      features: product.features.join('\n'),
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = {
        ...form,
        originalPrice: form.originalPrice || undefined,
        discountBadge: form.discountBadge || undefined,
        images: form.images ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : [],
        features: form.features ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await api.put(`/products/${editing._id}`, body);
      } else {
        await api.post('/products', body);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Inventory</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage products</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-5 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors">
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Product</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Stock</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-12 object-cover bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium text-sm max-w-[250px] truncate">{product.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">ID: {product._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400 uppercase tracking-wider">
                    No products yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <h2 className="text-sm uppercase tracking-wider font-bold">
                {editing ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Price</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Original Price</label>
                  <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })} className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Discount Badge</label>
                  <input value={form.discountBadge} onChange={e => setForm({ ...form, discountBadge: e.target.value })} className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="e.g. SALE" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Category</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="e.g. panjabi, trouser" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Images (one URL per line)</label>
                  <textarea rows={3} value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none font-mono text-xs" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Features (one per line)</label>
                  <textarea rows={3} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" placeholder="Premium Cotton&#10;Comfort Fit" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-900 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
