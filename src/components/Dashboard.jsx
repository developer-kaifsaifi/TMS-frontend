import React, {
  useState,
  useEffect,
} from "react";

import { motion } from "motion/react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import { io } from "socket.io-client";

import {
  FiLogOut,
  FiRotateCcw,
  FiDownload,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";

const socket = io(
  "https://tms-backend-ybex.onrender.com"
);

const Dashboard = () => {
  const [tokens, setTokens] =
    useState([]);

  const [businessData, setBusinessData] =
    useState(null);

  const navigate =
    useNavigate();

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "authToken"
      )}`,
    },
  });

  useEffect(() => {
    const fetchData =
      async () => {
        try {
          const stored =
            JSON.parse(
              localStorage.getItem(
                "businessData"
              )
            );

          if (!stored)
            return navigate(
              "/login"
            );

          setBusinessData(
            stored
          );

          const res =
            await axios.get(
              "https://tms-backend-ybex.onrender.com/api/v1/tokens/active-tokens",
              getAuthHeader()
            );

          setTokens(
            res.data.tokens
          );

          socket.emit(
            "joinBusiness",
            stored._id
          );
        } catch (err) {
          if (
            err.response
              ?.status === 401
          )
            navigate(
              "/login"
            );
        }
      };

    fetchData();

    socket.on(
      "newTokenGenerated",
      (newToken) =>
        setTokens(
          (prev) => [
            ...prev,
            newToken,
          ]
        )
    );

    // Reset Listener
    socket.on(
      "queueReset",
      () => {
        setTokens([]);
      }
    );

    return () => {
      socket.off(
        "newTokenGenerated"
      );

      socket.off(
        "queueReset"
      );
    };
  }, [navigate]);

  const handleReset =
    async () => {
      if (
        !window.confirm(
          "Kya aap sach mein sab reset karke #1 se start karna chahte hain?"
        )
      )
        return;

      try {
        await axios.delete(
          "https://tms-backend-ybex.onrender.com/api/v1/tokens/reset-queue",
          getAuthHeader()
        );

        setTokens([]);
      } catch (err) {
        alert(
          "Reset failed!"
        );
      }
    };

  const handleServeNext =
    async () => {
      if (
        tokens.length === 0
      )
        return;

      try {
        await axios.patch(
          `https://tms-backend-ybex.onrender.com/api/v1/tokens/serve/${tokens[0]._id}`,
          {},
          getAuthHeader()
        );

        setTokens((prev) =>
          prev.slice(1)
        );
      } catch (err) {
        alert(
          "Error serving next"
        );
      }
    };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-180px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 p-6 md:p-10">

        {/* Top Navbar */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 md:items-center mb-10">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">

              <span className="text-3xl font-black">
                D
              </span>

            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight">
                DigiFlow
              </h1>

              <p className="text-slate-400 mt-1">
                {
                  businessData?.name
                }
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">

            <button
              onClick={
                handleReset
              }
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500/20 transition-all"
            >
              <FiRotateCcw />
              Reset Queue
            </button>

            <button
              onClick={() => {
                localStorage.clear();

                navigate(
                  "/login"
                );
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-all"
            >
              <FiLogOut />
              Logout
            </button>

          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Current Serving */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl text-center"
            >

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6">

                <FiArrowRight />

                LIVE SERVING

              </div>

              <p className="text-slate-400 font-semibold uppercase tracking-[0.2em] mb-4 text-sm">
                Now Serving
              </p>

              <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-10">
                {tokens.length >
                0
                  ? `#${tokens[0].tokenNumber}`
                  : "--"}
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  handleServeNext
                }
                disabled={
                  tokens.length ===
                  0
                }
                className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-40"
              >
                CALL NEXT
              </motion.button>

            </motion.div>

            {/* Upcoming Queue */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl"
            >

              <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3">

                  <FiUsers className="text-blue-400 text-xl" />

                  <h3 className="text-2xl font-black">
                    Upcoming Queue
                  </h3>

                </div>

                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                  {tokens.length >
                  1
                    ? tokens.length -
                      1
                    : 0}{" "}
                  Pending
                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                {tokens
                  .slice(1)
                  .map((t) => (
                    <motion.div
                      whileHover={{
                        y: -4,
                        scale: 1.03,
                      }}
                      key={
                        t._id
                      }
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-blue-500/40 transition-all"
                    >
                      <p className="text-3xl font-black text-white">
                        #
                        {
                          t.tokenNumber
                        }
                      </p>
                    </motion.div>
                  ))}

              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl text-center h-fit"
          >

            <p className="text-sm font-black text-slate-500 uppercase tracking-[0.25em] mb-8">
              QR Poster
            </p>

            <div className="bg-white p-5 rounded-3xl shadow-2xl mb-8">

              <img
                src={
                  businessData?.qrCodeUrl
                }
                alt="QR"
                className="w-56 h-56 mx-auto"
              />

            </div>

            <a
              href={
                businessData?.qrCodeUrl
              }
              download="QR.png"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >

              <FiDownload />

              Download QR

            </a>

            <div className="mt-8 pt-6 border-t border-white/10">

              <p className="text-[10px] text-slate-500 font-bold tracking-[0.25em] uppercase">
                Powered by{" "}
                <span className="text-blue-400">
                  DigiFlow
                </span>
              </p>

            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;