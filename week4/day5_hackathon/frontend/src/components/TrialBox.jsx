import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

const TrialBox = () => {
  const { isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleStartTrial = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const { data } = await API.post("/plans/trial");
      if (data.success) {
        setMessage(data.message);
        await refreshUser();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to activate trial."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex lg:flex-row flex-col justify-between items-center gap-5 bg-[url('/assets/trial-img.png')] bg-cover bg-center bg-no-repeat lg:px-20 px-5 lg:py-25 py-10 rounded-lg mt-10 lg:text-left text-center">
        <div className="flex flex-col gap-5">
          <h4 className="lg:text-[38px] text-[24px] font-bold">
            Start your free trial today!
          </h4>
          <p className="text-[#999999] lg:text-[18px] text-[14px]">
            This is a clear and concise call to action that encourages users
            to sign up for a free trial of StreamVibe.
          </p>
          {message && (
            <p className="text-[14px] text-green-400">{message}</p>
          )}
        </div>
        <button
          onClick={handleStartTrial}
          disabled={loading}
          className="bg-[#E50000] hover:bg-red-700 disabled:opacity-50 border transition-all border-black px-5 py-3 mt-5 rounded-lg text-white font-medium whitespace-nowrap flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : null}
          Start a Free Trial
        </button>
      </div>
    </div>
  );
};

export default TrialBox;