import { useEffect, useState } from 'react';
import { adminService } from '../../services/user/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';
import { FaSearch, FaTrash, FaEdit } from 'react-icons/fa';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const res = await adminService.getUsers(params);
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(1); setCurrentPage(1); }, [roleFilter, search]);

  const handleUpdateUser = async (id, data) => {
    try {
      const res = await adminService.updateUser(id, data);
      setUsers(prev => prev.map(u => u._id === id ? res.data.user : u));
      toast.success('User updated');
      setEditingUser(null);
    } catch { toast.error('Failed to update user'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">User Management</h1>
        <p className="text-text-sub mt-1">{total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['', 'user', 'agent', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${roleFilter === r ? 'bg-primary text-dark border-primary' : 'bg-white text-text-sub border-border hover:border-primary'}`}>
              {r ? r.charAt(0).toUpperCase() + r.slice(1) + 's' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">User</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Phone</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Role</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Joined</th>
                    <th className="text-left text-xs font-medium text-text-sub px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-background/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-main">{user.name}</p>
                            <p className="text-xs text-text-sub">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-sub">{user.phone || '—'}</td>
                      <td className="px-5 py-4">
                        {editingUser === user._id ? (
                          <select
                            defaultValue={user.role}
                            onChange={e => handleUpdateUser(user._id, { role: e.target.value })}
                            className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`badge text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'agent' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{user.role}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-text-sub">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(editingUser === user._id ? null : user._id)}
                            className="p-2 text-text-sub hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                            title="Edit Role"
                          ><FaEdit className="text-sm" /></button>
                          <button
                            onClick={() => handleUpdateUser(user._id, { isActive: !user.isActive })}
                            className={`p-2 rounded-lg transition-colors text-xs font-medium px-3 ${user.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                          >{user.isActive ? 'Deactivate' : 'Activate'}</button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-text-sub hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          ><FaTrash className="text-sm" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); fetchUsers(p); }} />
        </>
      )}
    </div>
  );
}
