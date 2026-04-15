'use client';

import { useState } from 'react';
import { Search, ShieldCheck, ShieldOff, Trash2, UserPlus, Crown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { User } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminManagementPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const [promoteSearch, setPromoteSearch] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  // Redirect if not super admin
  useEffect(() => {
    if (currentUser && !isSuperAdmin) {
      router.push('/admin');
      toast.error('Super Admin access required');
    }
  }, [currentUser, isSuperAdmin, router]);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminApi.getUsers();
      return res.data;
    },
    enabled: isSuperAdmin,
  });

  const admins = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
  const regularUsers = users.filter(u => u.role === 'user');
  const searchedUsers = promoteSearch.trim()
    ? regularUsers.filter(u =>
        u.name.toLowerCase().includes(promoteSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(promoteSearch.toLowerCase())
      )
    : [];

  const promoteMutation = useMutation({
    mutationFn: (id: string) => adminApi.updateUserRole(id, 'admin'),
    onSuccess: () => {
      toast.success('User promoted to Admin!');
      setPromoteSearch('');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to promote user'),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => adminApi.updateUserRole(id, 'user'),
    onSuccess: () => {
      toast.success('Admin role revoked');
      setConfirmRevoke(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to revoke role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success('Admin account deleted');
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Failed to delete admin'),
  });

  if (!isSuperAdmin) return null;

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <ShieldCheck size={20} className="text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold font-integral">Manage Admins</h1>
          </div>
          <p className="text-sm text-gray-500">Home &gt; Manage Admins</p>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold">
          <Crown size={16} /> Super Admin Panel
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Admins', count: admins.filter(a => a.role === 'admin').length, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Super Admins', count: admins.filter(a => a.role === 'superadmin').length, icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Regular Users', count: regularUsers.length, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={22} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{stat.count}</p>
                <p className="text-xs font-bold text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Current Admins List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-500" /> Current Admins
              <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-semibold">{admins.length}</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {admins.length === 0 && (
              <p className="p-8 text-center text-sm text-gray-400 italic">No admins yet</p>
            )}
            {admins.map(admin => {
              const isCurrentUser = admin._id === currentUser?._id;
              const isSA = admin.role === 'superadmin';
              return (
                <div key={admin._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${isSA ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                    {admin.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm truncate">{admin.name}</p>
                      {isCurrentUser && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">YOU</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isSA ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {isSA ? 'Super Admin' : 'Admin'}
                    </span>
                    {!isCurrentUser && !isSA && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setConfirmRevoke(admin)}
                          title="Revoke admin role"
                          className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <ShieldOff size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(admin)}
                          title="Delete admin"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Promote User to Admin */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <UserPlus size={18} className="text-green-500" /> Promote User to Admin
            </h2>
            <p className="text-xs text-gray-500 mt-1">Search for a regular user and grant them admin access</p>
          </div>
          <div className="p-5">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={promoteSearch}
                onChange={e => setPromoteSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003B73] bg-gray-50"
              />
            </div>

            {promoteSearch && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {searchedUsers.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-400 italic">No regular users match your search</p>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                    {searchedUsers.map(u => (
                      <div key={u._id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {u.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                        <button
                          onClick={() => promoteMutation.mutate(u._id)}
                          disabled={promoteMutation.isPending}
                          className="shrink-0 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <ShieldCheck size={12} />
                          {promoteMutation.isPending ? 'Promoting...' : 'Promote'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!promoteSearch && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <UserPlus size={40} className="mb-3 opacity-30" />
                <p className="text-sm text-center">Start typing above to find a user to promote</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {confirmRevoke && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldOff size={28} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Revoke Admin Role?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">
              <span className="font-bold text-gray-800">{confirmRevoke.name}</span> will lose their admin access.
            </p>
            <p className="text-sm text-gray-500 text-center mb-6">They will be downgraded to a regular user.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRevoke(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => revokeMutation.mutate(confirmRevoke._id)}
                disabled={revokeMutation.isPending}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {revokeMutation.isPending ? 'Revoking...' : 'Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Admin Account?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">
              <span className="font-bold text-gray-800">{confirmDelete.name}</span>'s account will be permanently deleted.
            </p>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete._id)}
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
