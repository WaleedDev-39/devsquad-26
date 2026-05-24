import React, { useState, useEffect } from "react";
import API from "../../api";
import { Search, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/users", {
        params: {
          page: pagination.page,
          limit: 10,
          search: search || undefined,
        },
      });
      if (data.success) {
        setUsers(data.users);
        setPagination((prev) => ({
          ...prev,
          pages: data.pagination.pages,
          total: data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleBlock = async (userId) => {
    try {
      setActionLoading(userId);
      await API.put(`/admin/users/${userId}/block`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: true } : u))
      );
    } catch (error) {
      console.error("Failed to block user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      setActionLoading(userId);
      await API.put(`/admin/users/${userId}/unblock`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: false } : u))
      );
    } catch (error) {
      console.error("Failed to unblock user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Users Management</h1>
        <p className="text-[#999] text-[14px] mt-1">
          Manage platform users — {pagination.total} total users
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#1A1A1A] border border-[#262626] rounded-lg pl-10 pr-4 py-3 text-white text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
          />
        </div>
        <button
          type="submit"
          className="bg-[#E50000] hover:bg-red-700 text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all"
        >
          Search
        </button>
      </form>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="w-8 h-8 border-3 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#262626]">
                    <th className="text-left text-[13px] text-[#999] font-medium px-6 py-4">
                      User
                    </th>
                    <th className="text-left text-[13px] text-[#999] font-medium px-6 py-4">
                      Email
                    </th>
                    <th className="text-left text-[13px] text-[#999] font-medium px-6 py-4">
                      Subscription
                    </th>
                    <th className="text-left text-[13px] text-[#999] font-medium px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-[13px] text-[#999] font-medium px-6 py-4">
                      Joined
                    </th>
                    <th className="text-right text-[13px] text-[#999] font-medium px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[#262626]/50 hover:bg-[#262626]/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#E50000]/20 rounded-full flex items-center justify-center text-[#E50000] text-[13px] font-bold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-white text-[14px] font-medium">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#999] text-[14px]">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[12px] px-2.5 py-1 rounded-full ${
                            user.subscription?.isActive
                              ? "bg-green-500/15 text-green-400"
                              : "bg-[#262626] text-[#999]"
                          }`}
                        >
                          {user.subscription?.isActive
                            ? user.subscription?.isTrial
                              ? "Trial"
                              : "Active"
                            : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[12px] px-2.5 py-1 rounded-full ${
                            user.isBlocked
                              ? "bg-red-500/15 text-red-400"
                              : "bg-green-500/15 text-green-400"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#999] text-[13px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.isBlocked ? (
                          <button
                            onClick={() => handleUnblock(user._id)}
                            disabled={actionLoading === user._id}
                            className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-400 hover:bg-green-500/25 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all disabled:opacity-50"
                          >
                            {actionLoading === user._id ? (
                              <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckCircle size={13} />
                            )}
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(user._id)}
                            disabled={actionLoading === user._id}
                            className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all disabled:opacity-50"
                          >
                            {actionLoading === user._id ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Ban size={13} />
                            )}
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-[#999] py-12 text-[14px]"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="bg-[#1A1A1A] border border-[#262626] text-white p-2 rounded-lg disabled:opacity-30 hover:bg-[#262626] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[#999] text-[14px]">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.pages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.pages}
                className="bg-[#1A1A1A] border border-[#262626] text-white p-2 rounded-lg disabled:opacity-30 hover:bg-[#262626] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
