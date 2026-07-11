import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2, X, Upload, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

interface PaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

const emptyForm = {
  name: '', price: 0, originalPrice: 0, discountBadge: '',
  description: '', category: '', images: [] as string[], features: '', stock: 0,
};

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get<PaginatedResponse>(`/products?page=${page}&limit=${PAGE_SIZE}`)
      .then(res => {
        setProducts(res.products);
        setTotalPages(res.pages);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    api.get<{ _id: string; name: string }[]>('/categories')
      .then(setCategories)
      .catch(() => {});
  }, [page]);

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
      images: [...product.images],
      features: product.features.join('\n'),
      stock: product.stock,
    });
    setShowModal(true);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        features: form.features ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await api.put(`/products/${editing._id}`, body);
      } else {
        await api.post('/products', body);
      }
      setShowModal(false);
      setPage(1);
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Inventory</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage products</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors w-full sm:w-auto">
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3 mb-6">{error}</div>
      )}

      {/* Desktop table */}
      <div className="bg-white border border-gray-200 overflow-hidden hidden md:block">
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8">
                    <TableSkeleton rows={5} cols={5} />
                  </td>
                </tr>
              ) : (
                products.map(product => (
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
                      <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
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
                ))
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400 uppercase tracking-wider">No products yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : (
          products.map(product => (
            <div key={product._id} className="bg-white border border-gray-200 p-4 space-y-3">
              <div className="flex items-start gap-3">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt="" className="w-16 h-20 object-cover bg-gray-100 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">ID: {product._id.slice(-8)}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-[10px] font-bold uppercase tracking-wider">{product.category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold">${product.price.toLocaleString()}</span>
                  <span className={`font-medium text-xs ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-gray-100 rounded">
                    <Pencil size={14} className="text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-1.5 hover:bg-red-50 rounded">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-xs text-gray-400 uppercase tracking-wider">No products yet</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 md:gap-4 mt-6 md:mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 md:px-4 py-2 border border-gray-200 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <div className="flex items-center gap-1 md:gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 md:w-9 md:h-9 text-xs font-bold border transition-colors ${
                  page === i + 1
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 md:px-4 py-2 border border-gray-200 text-xs uppercase tracking-wider font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-2xl md:max-h-[90vh] overflow-y-auto md:rounded md:mx-4 max-h-[95vh] rounded-t-2xl md:rounded-t">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b border-gray-100">
              <h2 className="text-sm uppercase tracking-wider font-bold">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 md:px-8 py-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3">{error}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white">
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name.toLowerCase()}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Images</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-24 border border-gray-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {uploading && (
                      <div className="w-20 h-24 border border-gray-200 flex items-center justify-center bg-gray-50">
                        <Loader size={18} className="animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors disabled:opacity-50 w-full md:w-auto">
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
                <div className="md:col-span-2">
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
