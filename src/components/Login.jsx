import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        // 🔥 CRITICAL: Backend 'authToken' bhej raha hai
        const token = res.data.authToken;

        const business =
          res.data.business;

        if (token) {
          localStorage.setItem(
            "authToken",
            token
          );

          localStorage.setItem(
            "businessData",
            JSON.stringify(business)
          );

          console.log(
            "Login Success: Token Saved"
          );

          navigate("/dashboard");
        }
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center px-4 overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-180px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />

      {/* Login Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <form
          onSubmit={handleLogin}
          className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl"
        >

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">

            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-5">
              <span className="text-3xl font-black text-white">
                D
              </span>
            </div>

            <h1 className="text-4xl font-black text-white tracking-tight">
              DigiFlow
            </h1>

            <p className="text-slate-400 mt-2 text-center">
              Smart Queue Management
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">

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
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">

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
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-14 py-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all"
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
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

          {/* Login Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-60"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </motion.button>

          {/* Register Redirect */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don’t have an account?{" "}

              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-all"
              >
                Register
              </Link>
            </p>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default Login;