import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2, X, Upload, Loader } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  createdAt: string;
}

const emptyForm = { name: '', image: '', description: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = () => {
    setLoading(true);
    api.get<Category[]>('/categories')
      .then(setCategories)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, image: cat.image || '', description: cat.description || '' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = { ...form };
      if (!body.image) delete body.image;
      if (!body.description) delete body.description;
      if (editing) {
        await api.put(`/categories/${editing._id}`, body);
      } else {
        await api.post('/categories', body);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
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

      setForm(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category? Products in this category will not be deleted.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      fetchCategories();
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white border border-gray-200 p-6 space-y-4">
            <div className="w-full aspect-video bg-gray-200 animate-pulse" />
            <div className="h-4 bg-gray-200 animate-pulse w-2/3" />
            <div className="h-3 bg-gray-200 animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Categories</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage product categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors w-full sm:w-auto">
          <Plus size={14} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3 mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map(cat => (
          <div key={cat._id} className="bg-white border border-gray-200 p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0 flex-1 mr-2">
                <h3 className="font-bold uppercase tracking-wide text-sm truncate">{cat.name}</h3>
                {cat.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded"><Pencil size={13} className="text-gray-500" /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={13} className="text-red-400" /></button>
              </div>
            </div>
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover bg-gray-100" />
            ) : (
              <div className="w-full h-32 bg-gray-50 flex items-center justify-center text-gray-300 text-xs uppercase tracking-wider font-bold">No Image</div>
            )}
            <div className="mt-3 text-[10px] text-gray-400 uppercase tracking-wider">
              Created {new Date(cat.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 text-xs text-gray-400 uppercase tracking-wider">
            No categories yet
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto mx-2 md:mx-0">
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100">
              <h2 className="text-sm uppercase tracking-wider font-bold">
                {editing ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 md:px-8 py-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3">{error}</div>
              )}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Image</label>
                {form.image && (
                  <div className="relative w-24 h-24 border border-gray-200 mb-3">
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, image: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </div>
                )}
                {uploading && (
                  <div className="w-24 h-24 border border-gray-200 flex items-center justify-center bg-gray-50 mb-3">
                    <Loader size={18} className="animate-spin text-gray-400" />
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors disabled:opacity-50">
                  <Upload size={14} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
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
