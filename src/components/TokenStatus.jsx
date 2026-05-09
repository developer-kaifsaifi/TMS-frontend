import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { useParams } from "react-router-dom";

import { motion } from "framer-motion";

import { io } from "socket.io-client";

import axios from "axios";

import {
  FiUsers,
  FiBell,
  FiRefreshCw,
} from "react-icons/fi";

const socket = io("http://localhost:5000");

const TokenStatus = () => {
  const { tokenId } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchStatus = useCallback(
    async () => {
      try {
        const res = await axios.get(
          `https://digiflow-chi.vercel.app/api/v1/tokens/status/${tokenId}`
        );

        setData(res.data.token);

        socket.emit(
          "joinBusiness",
          res.data.token.businessId
        );
      } catch (err) {
        console.log(
          "Token not found - likely reset by admin."
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [tokenId]
  );

  useEffect(() => {
    fetchStatus();

    socket.on(
      "queueUpdated",
      (payload) => {
        setData((prev) =>
          prev
            ? {
                ...prev,
                currentServing:
                  payload.currentServing,
              }
            : null
        );
      }
    );

    socket.on("queueReset", () => {
      setData(null);
    });

    return () => {
      socket.off("queueUpdated");

      socket.off("queueReset");
    };
  }, [fetchStatus]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center text-white text-xl font-semibold">
        Loading Status...
      </div>
    );
  }

  // Queue Reset
  if (!data) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center px-4 overflow-hidden relative">

        {/* Glow */}
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl text-center">

            <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <FiRefreshCw
                size={40}
                className="text-blue-400"
              />
            </div>

            <h2 className="text-3xl font-black text-white mb-4">
              Queue Reset!
            </h2>

            <p className="text-slate-400 leading-relaxed mb-8">
              Admin ne queue reset kar
              diya hai. Kripya naya
              token lene ke liye QR
              scan karein.
            </p>

            <button
              onClick={() =>
                (window.location.href =
                  "/")
              }
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-xl"
            >
              Okay
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const peopleAhead = Math.max(
    0,
    data.tokenNumber -
      data.currentServing
  );

  const isMyTurn =
    data.tokenNumber <=
    data.currentServing;

    const isServed =
  data.currentServing >
  data.tokenNumber;

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center px-4 overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-180px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />

      {/* Card */}
      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl">

          {/* Top Status Bar */}
          <div
            className={`py-4 text-center text-white font-bold text-xs tracking-[0.25em] uppercase ${
              isMyTurn
                ? "bg-green-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-600"
            }`}
          >
            {isMyTurn
              ? "Proceed To Counter"
              : "Live Queue Status"}
          </div>

          {/* Content */}
          <div className="p-10 text-center">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">

              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-5">
                <span className="text-3xl font-black text-white">
                  D
                </span>
              </div>

              <h1 className="text-3xl font-black text-white">
                DigiFlow
              </h1>

              <p className="text-slate-400 mt-2">
                Smart Queue Management
              </p>
            </div>

            {/* Your Token */}
            <div className="mb-10">

              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.25em] mb-3">
                Your Token
              </p>

              <div className="text-8xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                #{data.tokenNumber}
              </div>
            </div>

            {/* Current Serving */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center mb-8">

              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.25em] mb-3">
                Now Serving
              </p>

              <div className="text-6xl font-black text-blue-400">
                #{data.currentServing}
              </div>
            </div>

{/* Status */}
{isServed ? (

  <div className="mt-2 flex items-center justify-center gap-2 text-red-400 font-bold text-xl">
    <FiRefreshCw />
    Token Expired
  </div>

) : !isMyTurn ? (

  <div className="flex items-center justify-center gap-2 text-slate-300">

    <FiUsers className="text-blue-400" />

    <p className="text-sm font-medium">
      <span className="text-blue-400 font-bold">
        {peopleAhead} people
      </span>{" "}
      ahead of you
    </p>
  </div>

) : (

  <motion.div
    animate={{
      scale: [1, 1.05, 1],
    }}
    transition={{
      repeat: Infinity,
      duration: 1.5,
    }}
    className="mt-2 flex items-center justify-center gap-2 text-green-400 font-bold text-xl"
  >
    <FiBell />
    It's Your Turn!
  </motion.div>

)}

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-white/10">

              <p className="text-[10px] text-slate-500 font-bold tracking-[0.25em] uppercase">
                Securely Powered by{" "}
                <span className="text-blue-400">
                  DigiFlow Systems
                </span>
              </p>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TokenStatus;