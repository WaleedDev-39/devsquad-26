import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, registerUser } from "../services/api";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(form);
      setSuccess("Account created successfully! Redirecting to login...");

      // Give the user a moment to read the message, then redirect.
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center mt-10">
        <div className="bg-gray-200 px-18 py-10 rounded-lg shadow-md  mx-20 flex justify-center flex-col items-center">
          <h2 className="font-bold text-3xl text-black mb-5">
            CREATE NEW ACCOUNT
          </h2>

          {error ? (
            <div className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded mb-3 w-full text-center">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded mb-3 w-full text-center">
              {success}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col  gap-1">
              <label htmlFor="fullName">Full Name</label>
              <input
                className="border-1 outline-none rounded-sm pl-2 py-1"
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex flex-col  gap-1">
              <label htmlFor="email">Email</label>
              <input
                className="border-1 outline-none rounded-sm pl-2 py-1"
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col  gap-1">
              <label htmlFor="password">Password</label>
              <input
                className="border-1 outline-none rounded-sm pl-2 py-1"
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 w-1/2 self-center text-white px-2 py-1 rounded-md cursor-pointer font-bold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
