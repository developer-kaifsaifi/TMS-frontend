import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const TokenStatus = () => {
  const { tokenId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/tokens/status/${tokenId}`);
      setData(res.data.token);
      socket.emit("joinBusiness", res.data.token.businessId);
    } catch (err) {
      console.log("Token not found - likely reset by admin.");
      setData(null); // Error aane par data null set karenge
    } finally {
      setLoading(false);
    }
  }, [tokenId]);

  useEffect(() => {
    fetchStatus();

    socket.on("queueUpdated", (payload) => {
      setData(prev => prev ? { ...prev, currentServing: payload.currentServing } : null);
    });

    socket.on("queueReset", () => {
      setData(null); // Admin reset karte hi customer screen clear
    });

    return () => {
      socket.off("queueUpdated");
      socket.off("queueReset");
    };
  }, [fetchStatus]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Loading...</div>;

  // 🔄 Agar Token Database mein nahi mila (Reset ke baad)
  if (!data) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-sm border">
          <div className="text-6xl mb-6">🔄</div>
          <h2 className="text-2xl font-black mb-4">Queue Reset!</h2>
          <p className="text-gray-500 mb-8">Admin ne queue ko reset kar diya hai. Kripya naya token lene ke liye QR scan karein.</p>
          <button onClick={() => window.location.href = "/"} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">OKAY</button>
        </div>
      </div>
    );
  }

  const peopleAhead = Math.max(0, data.tokenNumber - data.currentServing);
  const isMyTurn = data.tokenNumber <= data.currentServing;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
        <div className={`py-4 text-center text-white font-bold text-xs tracking-widest ${isMyTurn ? "bg-green-500" : "bg-blue-600"}`}>
          {isMyTurn ? "PROCEED TO COUNTER" : "LIVE STATUS"}
        </div>
        <div className="p-10 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Your Token</p>
          <div className="text-8xl font-black text-slate-900 mb-10">#{data.tokenNumber}</div>
          
          <div className="bg-slate-50 rounded-3xl p-6 border text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Now Serving</p>
            <div className="text-5xl font-black text-blue-600">#{data.currentServing}</div>
          </div>

          {!isMyTurn ? (
            <p className="mt-8 text-sm font-medium text-gray-500">
              <span className="text-blue-600 font-bold">{peopleAhead} people</span> ahead of you
            </p>
          ) : (
            <div className="mt-8 text-green-600 font-bold animate-bounce text-lg">🔔 It's Your Turn!</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TokenStatus;