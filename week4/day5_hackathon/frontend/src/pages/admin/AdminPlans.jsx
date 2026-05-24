import React, { useState, useEffect } from "react";
import API from "../../api";
import { Plus, X, CreditCard } from "lucide-react";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "monthly",
    features: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await API.get("/plans");
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title || !form.description || !form.price) {
      setFormError("Title, description, and price are required.");
      return;
    }

    try {
      setFormLoading(true);
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        duration: form.duration,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };

      const { data } = await API.post("/plans/create", payload);
      if (data.success) {
        setPlans((prev) => [...prev, data.plan]);
        setShowModal(false);
        setForm({
          title: "",
          description: "",
          price: "",
          duration: "monthly",
          features: "",
        });
      }
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to create plan.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-white">Subscription Plans</h1>
          <p className="text-[#999] text-[14px] mt-1">
            Manage subscription plans for StreamVibe
          </p>
        </div>
        <button
          onClick={() => {
            setFormError("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#E50000] hover:bg-red-700 text-white px-5 py-3 rounded-lg text-[14px] font-medium transition-all"
        >
          <Plus size={16} />
          Create Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 hover:border-[#333] transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E50000]/15 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-[#E50000]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[18px]">
                  {plan.title}
                </h3>
                <span className="text-[#999] text-[12px] capitalize">
                  {plan.duration}
                </span>
              </div>
            </div>

            <p className="text-[#999] text-[14px] mb-4 line-clamp-2">
              {plan.description}
            </p>

            <div className="mb-4">
              <span className="text-white text-[32px] font-bold">
                ${plan.price}
              </span>
              <span className="text-[#999] text-[14px]">
                /{plan.duration === "yearly" ? "year" : "month"}
              </span>
            </div>

            {plan.features?.length > 0 && (
              <div className="border-t border-[#262626] pt-4">
                <p className="text-[#999] text-[12px] mb-2">Features:</p>
                <ul className="flex flex-col gap-1.5">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-[#ccc] text-[13px] flex items-center gap-2"
                    >
                      <span className="w-1. h-1.5 rounded-full bg-[#E50000]"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full text-center text-[#999] py-16 text-[14px]">
            No plans created yet. Click "Create Plan" to add one.
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-[#1A1A1A] border border-[#262626] rounded-xl w-full max-w-md">
            <div className="border-b border-[#262626] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-[20px] font-bold">Create Plan</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#999] hover:text-white p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-[13px]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[13px] text-[#999] mb-1.5">
                  Plan Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Premium Plan"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] text-[#999] mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                  placeholder="Plan description..."
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="9.99"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">
                    Duration
                  </label>
                  <select
                    value={form.duration}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#999] mb-1.5">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.features}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, features: e.target.value }))
                  }
                  placeholder="HD Quality, Multi-device, Offline"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-[14px] focus:outline-none focus:border-[#E50000] transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#262626] hover:bg-[#333] text-white py-3 rounded-lg text-[14px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-[#E50000] hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg text-[14px] font-medium transition-all flex items-center justify-center"
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Create Plan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
