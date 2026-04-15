import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import TrialBox from "../TrialBox";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await API.get("/plans");
      if (data.success && data.plans.length > 0) {
        setPlans(data.plans);
      }
    } catch (error) {
      // Fallback to static data if API fails
      console.log("Using static plans data");
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePlan = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/subscriptions");
    }
  };

  // Filter plans by billing cycle
  const filteredPlans = plans.filter((p) => p.duration === billingCycle);
  const displayPlans = filteredPlans.length > 0 ? filteredPlans : plans;

  return (
    <div>
      <div className="lg:px-10 px-2 mt-10">
        <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start gap-5">
          <div>
            <h4 className="lg:text-[38px] text-[24px] font-bold">
              Choose the plan that's right for you
            </h4>
            <p className="text-[#999999] lg:text-[18px] text-[14px]">
              Join StreamVibe and select from our flexible subscription options
              tailored to suit your viewing preferences. Get ready for non-stop
              entertainment!
            </p>
          </div>

          <div className="bg-[#0F0F0F] border border-[#262626] p-2 rounded-md flex gap-2 items-center justify-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-2 rounded-md lg:text-[18px] text-[14px] transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#1F1F1F] text-white"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-2 rounded-md lg:text-[18px] text-[14px] transition-all ${
                billingCycle === "yearly"
                  ? "bg-[#1F1F1F] text-white"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* cards section */}
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-[#E50000] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
              {displayPlans.map((card) => (
                <div
                  key={card._id || card.id}
                  className="bg-[#1A1A1A] rounded-md p-10 flex flex-col gap-10"
                >
                  <div>
                    <h5 className="lg:text-[24px] text-[18px] font-bold">
                      {card.title}
                    </h5>
                    <p className="text-[#999999] lg:text-[18px] text-[14px]">
                      {card.description || card.desc}
                    </p>

                    <p className="lg:text-[40px] text-[24px] font-semibold mt-4">
                      ${card.price}
                      <span className="lg:text-[18px] text-[14px] font-medium text-[#999999]">
                        /{card.duration === "yearly" ? "year" : "month"}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-center items-center lg:gap-4 gap-3">
                    <button
                      onClick={handleChoosePlan}
                      className="bg-[#141414] hover:bg-black transition-all border border-[#262626] lg:px-3 md:px-2 px-4 whitespace-nowrap lg:py-2 md:py-1 py-2 rounded-lg lg:text-[18px] md:text-[10px] text-[14px]"
                    >
                      Start Free Trial
                    </button>
                    <button
                      onClick={handleChoosePlan}
                      className="bg-[#E50000] hover:bg-red-700 border transition-all border-black lg:px-3 md:px-2 px-4 whitespace-nowrap lg:py-2 md:py-1 py-2 rounded-lg lg:text-[18px] md:text-[10px] text-[14px]"
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <TrialBox />
      </div>
    </div>
  );
};

export default Plans;
