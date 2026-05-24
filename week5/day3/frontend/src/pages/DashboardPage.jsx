import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { adminAPI, orderAPI, productAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) { navigate("/"); return; }
    fetchData();
  }, [user, isAdmin, tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === "analytics") {
        const { data } = await adminAPI.getAnalytics();
        setAnalytics(data.analytics);
      } else if (tab === "users") {
        const { data } = await adminAPI.getUsers({ limit: 50 });
        setUsers(data.users);
      } else if (tab === "orders") {
        const { data } = await orderAPI.getAllOrders({ limit: 50 });
        setOrders(data.orders);
      } else if (tab === "products") {
        const { data } = await productAPI.getProducts({ limit: 50 });
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleBlockToggle = async (userId, blocked) => {
    try {
      if (blocked) await adminAPI.unblockUser(userId);
      else await adminAPI.blockUser(userId);
      toast.success(blocked ? "User unblocked" : "User blocked");
      fetchData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success("Status updated");
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productAPI.deleteProduct(productId);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const tabs = [
    { key: "analytics", label: "Analytics" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "users", label: "Users" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-24">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="animate-pulse bg-gray-100 h-28 rounded-lg" />)}
        </div>
      ) : (
        <>
          {/* Analytics */}
          {tab === "analytics" && analytics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Users", value: analytics.totalUsers, color: "bg-blue-50 text-blue-700" },
                { label: "Total Products", value: analytics.totalProducts, color: "bg-green-50 text-green-700" },
                { label: "Total Orders", value: analytics.totalOrders, color: "bg-purple-50 text-purple-700" },
                { label: "Revenue", value: `€${analytics.totalRevenue.toFixed(2)}`, color: "bg-yellow-50 text-yellow-700" },
                { label: "Pending", value: analytics.pendingOrders, color: "bg-orange-50 text-orange-700" },
                { label: "Delivered", value: analytics.deliveredOrders, color: "bg-emerald-50 text-emerald-700" },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} rounded-lg p-5`}>
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {tab === "products" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden md:table-cell">Stock</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover rounded hidden sm:block" />
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-600 hidden md:table-cell">{p.category}</td>
                      <td className="py-3 px-2 font-medium text-gray-900">€{p.price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-gray-600 hidden md:table-cell">{p.stock}</td>
                      <td className="py-3 px-2">
                        <button onClick={() => handleDeleteProduct(p._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-sm p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.user?.name || "Unknown"} <span className="text-gray-400 font-normal">({order.user?.email})</span></p>
                      <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <span className="text-base font-bold text-gray-900">€{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">{item.name} × {item.quantity}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden md:table-cell">Email</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{u.name}</td>
                      <td className="py-3 px-2 text-gray-600 hidden md:table-cell">{u.email}</td>
                      <td className="py-3 px-2">
                        <span className="text-xs font-semibold capitalize bg-gray-100 px-2 py-1 rounded">{u.role}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${u.blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {u.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleBlockToggle(u._id, u.blocked)}
                          className={`text-xs font-medium ${u.blocked ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"}`}
                        >
                          {u.blocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
