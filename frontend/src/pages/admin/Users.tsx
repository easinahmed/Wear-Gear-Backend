import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get<User[]>('/admin/users')
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    setUpdating(userId);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdating(null);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Users</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage user accounts</p>
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
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Name</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Role</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Joined</th>
                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider font-bold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRole(user._id, user.role)}
                      disabled={updating === user._id}
                      className="text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:text-black transition-colors disabled:opacity-50"
                    >
                      {updating === user._id ? 'Updating...' : `Make ${user.role === 'admin' ? 'User' : 'Admin'}`}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400 uppercase tracking-wider">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
