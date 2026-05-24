'use client';

import { useState } from 'react';
import { Search, Shield, ShieldOff, Trash2, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { User } from '@/types';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const ROLE_OPTIONS = ['user', 'admin', 'superadmin'] as const;

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    superadmin: 'bg-purple-100 text-purple-700 border-purple-200',
    admin: 'bg-blue-100 text-blue-700 border-blue-200',
    user: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[role] || map.user;
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminApi.getUsers();
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: (_, { role }) => {
      toast.success(`Role updated to ${role}`);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to update role (Super Admin required)'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted');
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to delete user (Super Admin required)'),
  });

  const filtered = users.filter(u => {
    const name = u.name || '';
    const email = u.email || '';
    const role = u.role || 'user';

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || role === roleFilter;
    return matchSearch && matchRole;
  });

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading users...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load users.</div>;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-integral">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Home &gt; Users</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
          <Users size={16} className="text-[#003B73]" />
          <span className="text-sm font-bold text-gray-700">{users.length} Total Users</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'All Users', count: users.length, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'bg-purple-50 text-purple-700 border-purple-100' },
          { label: 'Super Admins', count: users.filter(u => u.role === 'superadmin').length, color: 'bg-orange-50 text-orange-700 border-orange-100' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl p-5 border ${stat.color} bg-white shadow-sm flex items-center gap-4`}>
            <div className={`text-3xl font-black ${stat.color.split(' ')[1]}`}>{stat.count}</div>
            <div className="text-sm font-bold text-gray-700">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#003B73] bg-gray-50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:border-[#003B73]"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">#</th>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Loyalty Points</th>
                <th className="px-6 py-4 font-bold">Joined</th>
                {isSuperAdmin && <th className="px-6 py-4 font-bold text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">No users found</td>
                </tr>
              )}
              {filtered.map((u, idx) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-semibold">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#003B73] to-blue-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {u.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="font-bold text-gray-900">{u.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email || 'No Email'}</td>
                  <td className="px-6 py-4">
                    {isSuperAdmin && u._id !== currentUser?._id ? (
                      <select
                        value={u.role}
                        onChange={e => roleMutation.mutate({ id: u._id, role: e.target.value })}
                        disabled={roleMutation.isPending}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${roleBadge(u.role)}`}
                      >
                        {ROLE_OPTIONS.map(r => (
                          <option key={r} value={r}>{r === 'superadmin' ? 'Super Admin' : r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border inline-flex ${roleBadge(u.role || 'user')}`}>
                        {(u.role || 'user') === 'superadmin' ? 'Super Admin' : (u.role || 'user').charAt(0).toUpperCase() + (u.role || 'user').slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold text-gray-800">{u.loyaltyPoints?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 text-center">
                      {u._id === currentUser?._id ? (
                        <span className="text-xs text-gray-400 italic">You</span>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(u._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete User?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently delete the user account. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
