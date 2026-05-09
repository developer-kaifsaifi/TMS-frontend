import React, { useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { motion } from "motion/react";
import axios from "axios";

import {
  FiArrowRight,
  FiHash,
} from "react-icons/fi";

const ScanPage = () => {
  const { businessId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleGetToken = async () => {
    console.log(
      "Requesting token for business:",
      businessId
    );

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/tokens/generate/${businessId}`
      );

      // 1. Console me pura data check karo
      console.log(
        "Backend Response Data:",
        res.data
      );

      // 2. Flexible Check
      const finalTokenId =
        res.data.tokenId ||
        res.data.token?._id;

      if (
        res.data.success &&
        finalTokenId
      ) {
        console.log(
          "Redirecting to:",
          `/status/${finalTokenId}`
        );

        // 3. Forceful Navigation
        navigate(
          `/status/${finalTokenId}`
        );
      } else {
        console.error(
          "Redirection failed: Token ID not found in response",
          res.data
        );

        alert(
          "Token toh ban gaya par ID nahi mili. Dashboard check karein."
        );
      }
    } catch (err) {
      console.error(
        "Axios Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Connection Error"
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

      {/* Card */}
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
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl text-center">

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

            <p className="text-slate-400 mt-2">
              Smart Queue Management
            </p>
          </div>

          {/* Content */}
          <div className="mb-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6">
              <FiHash />
              Queue Access
            </div>

            <h2 className="text-3xl font-black text-white mb-3">
              Get Your Token
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Tap the button below to
              generate your live queue
              token instantly.
            </p>
          </div>

          {/* Business ID */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">

            <p className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-2">
              Business ID
            </p>

            <p className="text-white font-medium break-all">
              {businessId.slice(0, 8)}...
            </p>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={handleGetToken}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Get My Token
                <FiArrowRight />
              </>
            )}
          </motion.button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">

            <p className="text-[11px] text-slate-500 font-semibold tracking-[0.25em] uppercase">
              Securely Powered by{" "}
              <span className="text-blue-400">
                DigiFlow Systems
              </span>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanPage;