import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { Check, CreditCard, X } from "lucide-react";
import Footer from "../components/Footer";

const SubscriptionPage = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Payment form
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

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

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedPlan(plan);
    setPaymentError("");
    setPaymentSuccess("");
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setPaymentError("Please fill in all card details.");
      return;
    }

    try {
      setPaymentLoading(true);
      const { data } = await API.post("/plans/subscribe", {
        planId: selectedPlan._id,
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
      });
      if (data.success) {
        setPaymentSuccess(data.message);
        await refreshUser();
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentSuccess("");
        }, 2000);
      }
    } catch (error) {
      setPaymentError(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter plans by billing cycle
  const filteredPlans = plans.filter(
    (p) => p.duration === billingCycle
  );
  const displayPlans = filteredPlans.length > 0 ? filteredPlans : plans;

  return (
    <div className="text-white">
      <div className="lg:px-20 px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[36px] lg:text-[48px] font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-[#999] text-[16px] lg:text-[18px] max-w-2xl mx-auto">
            Join StreamVibe and enjoy unlimited access to a huge library of
            movies and shows. Pick the plan that works best for you.
          </p>
        </div>

        {/* Current subscription info */}
        {isAuthenticated && user?.subscription?.isActive && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-10 max-w-2xl mx-auto text-center">
            <p className="text-green-400 font-medium text-[16px]">
              ✓ You have an active subscription
              {user.subscription.isTrial && " (Free Trial)"}
            </p>
            {user.subscription.endDate && (
              <p className="text-[#999] text-[14px] mt-1">
                Valid until{" "}
                {new Date(user.subscription.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-xl p-1.5 flex gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-lg text-[14px] font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#262626] text-white"
                  : "text-[#999] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-lg text-[14px] font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-[#262626] text-white"
                  : "text-[#999] hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-8 hover:border-[#E50000]/30 transition-all flex flex-col"
            >
              <h3 className="text-white text-[22px] font-bold mb-2">
                {plan.title}
              </h3>
              <p className="text-[#999] text-[14px] mb-6 flex-1">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-white text-[40px] font-bold">
                  ${plan.price}
                </span>
                <span className="text-[#999] text-[16px]">
                  /{plan.duration === "yearly" ? "year" : "month"}
                </span>
              </div>

              {plan.features?.length > 0 && (
                <ul className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-[#ccc] text-[14px]"
                    >
                      <Check size={16} className="text-[#E50000] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleSelectPlan(plan)}
                className="w-full bg-[#E50000] hover:bg-red-700 text-white py-3 rounded-lg text-[15px] font-semibold transition-all mt-auto"
              >
                Choose Plan
              </button>
            </div>
          ))}

          {displayPlans.length === 0 && (
            <div className="col-span-full text-center text-[#999] py-16">
              No plans available for this billing cycle.
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          />
          <div className="relative bg-[#1A1A1A] border border-[#262626] rounded-xl w-full max-w-md">
            <div className="border-b border-[#262626] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white text-[18px] font-bold">
                  Subscribe to {selectedPlan.title}
                </h2>
                <p className="text-[#999] text-[13px]">
                  ${selectedPlan.price}/{selectedPlan.duration === "yearly" ? "year" : "month"}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-[#999] hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePayment} className="p-6 flex flex-col gap-4">
              {paymentError && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-[13px]">
                  {paymentError}
                </div>
              )}
              {paymentSuccess && (
                <div className="bg-green-900/30 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-[13px]">
                  {paymentSuccess}
                </div>
              )}

              <div>
                <label className="block text-[13px] text-[#999] mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                  />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-10 pr-4 py-3 text-white text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#999] mb-1.5">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 text-white text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 text-white text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#999] mb-1.5">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 text-white text-[14px] placeholder:text-[#555] focus:outline-none focus:border-[#E50000] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentLoading}
                className="w-full bg-[#E50000] hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg text-[15px] font-semibold transition-all mt-2 flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Pay $${selectedPlan.price}`
                )}
              </button>

              <p className="text-[#666] text-[11px] text-center">
                This is a demo payment. No real charges will be made.
              </p>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SubscriptionPage;
