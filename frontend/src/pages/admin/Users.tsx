import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
}

interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = () => {
    setLoading(true);
    api.get<User[] | PaginatedUsers>(`/admin/users?page=${page}&limit=${PAGE_SIZE}`)
      .then(res => {
        if (Array.isArray(res)) {
          setUsers(res);
          setTotalPages(1);
        } else {
          setUsers(res.users || []);
          setTotalPages(res.pages || 1);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

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
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Users</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Manage user accounts</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Desktop table */}
      <div className="bg-white border border-gray-200 overflow-hidden hidden md:block">
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {users.map(user => (
          <div key={user._id} className="bg-white border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1 mr-2">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              <button
                onClick={() => toggleRole(user._id, user.role)}
                disabled={updating === user._id}
                className="uppercase tracking-wider font-bold text-gray-600 hover:text-black disabled:opacity-50"
              >
                {updating === user._id ? 'Updating...' : `Make ${user.role === 'admin' ? 'User' : 'Admin'}`}
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-12 text-xs text-gray-400 uppercase tracking-wider">No users found</div>
        )}
      </div>
    </div>
  );
}
