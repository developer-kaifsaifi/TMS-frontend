import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [businessData, setBusinessData] = useState(null);
  const navigate = useNavigate();

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("businessData"));
        if (!stored) return navigate("/login");
        setBusinessData(stored);

        const res = await axios.get("http://localhost:5000/api/v1/tokens/active-tokens", getAuthHeader());
        setTokens(res.data.tokens);
        socket.emit("joinBusiness", stored._id);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      }
    };
    fetchData();

    socket.on("newTokenGenerated", (newToken) => setTokens(prev => [...prev, newToken]));
    
    // Listener: Jab queue reset ho jaye
    socket.on("queueReset", () => {
      setTokens([]);
    });

    return () => {
      socket.off("newTokenGenerated");
      socket.off("queueReset");
    };
  }, [navigate]);

  const handleReset = async () => {
    if (!window.confirm("Kya aap sach mein sab reset karke #1 se start karna chahte hain?")) return;
    try {
      await axios.delete("http://localhost:5000/api/v1/tokens/reset-queue", getAuthHeader());
      setTokens([]); // Local state clear
    } catch (err) { alert("Reset failed!"); }
  };

  const handleServeNext = async () => {
    if (tokens.length === 0) return;
    try {
      await axios.patch(`http://localhost:5000/api/v1/tokens/serve/${tokens[0]._id}`, {}, getAuthHeader());
      setTokens(prev => prev.slice(1));
    } catch (err) { alert("Error serving next"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black">{businessData?.name}</h1>
        <div className="flex gap-4">
          <button onClick={handleReset} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold">Reset Queue</button>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold">Logout</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-center border">
            <p className="text-gray-400 font-bold uppercase tracking-widest mb-2">Now Serving</p>
            <div className="text-8xl font-black text-blue-600 mb-8">
              {tokens.length > 0 ? `#${tokens[0].tokenNumber}` : "--"}
            </div>
            <button onClick={handleServeNext} disabled={tokens.length === 0} className="w-full max-w-sm py-4 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-100">CALL NEXT</button>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] border">
            <h3 className="font-black mb-6">Upcoming Queue ({tokens.length > 1 ? tokens.length - 1 : 0})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {tokens.slice(1).map(t => (
                <div key={t._id} className="p-4 bg-gray-50 rounded-2xl text-center font-bold">#{t.tokenNumber}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border text-center">
          <h3 className="text-sm font-black text-gray-400 mb-6">QR POSTER</h3>
          <img src={businessData?.qrCodeUrl} alt="QR" className="w-48 h-48 mx-auto mb-6" />
          <a href={businessData?.qrCodeUrl} download="QR.png" className="block bg-gray-900 text-white py-3 rounded-xl font-bold">Download QR</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;