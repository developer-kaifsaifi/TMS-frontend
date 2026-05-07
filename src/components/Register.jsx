import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formData
      );

      if (response.data.success) {
        localStorage.setItem(
          "authToken",
          response.data.authToken
        );

        localStorage.setItem(
          "businessData",
          JSON.stringify(response.data.business)
        );

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] overflow-hidden relative flex items-center justify-center px-4">

      {/* Glow Effects */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-180px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex flex-col items-center mb-10">

            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-5">
              <span className="text-3xl font-black text-white">
                DF
              </span>
            </div>

            <h1 className="text-4xl font-black text-white tracking-tight">
              Digi<span className="text-blue-400">Flow</span>
            </h1>

            <p className="text-slate-400 mt-2 text-center">
              Smart Queue Management System
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Business Name */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Business Name
              </label>

              <div className="relative">

                <FiUser
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kaif Cafe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@business.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Password
              </label>

              <div className="relative">

                <FiLock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-14 py-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-all"
                >
                  {showPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>

              </div>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-60"
            >
              {isLoading
                ? "Creating Account..."
                : "Register Business"}
            </motion.button>

          </form>

          {/* Login Redirect */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Powered by DigiFlow
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;