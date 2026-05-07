import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";


const ScanPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGetToken = async () => {
    console.log("Requesting token for business:", businessId);
    setLoading(true);
    
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/tokens/generate/${businessId}`);
      
      // 1. Console me pura data check karo (F12 daba kar dekho)
      console.log("Backend Response Data:", res.data);

      // 2. Flexible Check: Agar tokenId hai ya token object ke andar _id hai
      const finalTokenId = res.data.tokenId || res.data.token?._id;

      if (res.data.success && finalTokenId) {
        console.log("Redirecting to:", `/status/${finalTokenId}`);
        
        // 3. Forceful Navigation
        navigate(`/status/${finalTokenId}`);
      } else {
        console.error("Redirection failed: Token ID not found in response", res.data);
        alert("Token toh ban gaya par ID nahi mili. Dashboard check karein.");
      }
    } catch (err) {
      console.error("Axios Error:", err);
      alert(err.response?.data?.message || "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white p-10 rounded-[2.5rem] shadow-xl text-center border border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Get Your Token</h1>
        <p className="text-gray-500 text-sm mb-10">Business ID: {businessId.slice(0, 8)}...</p>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGetToken}
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg disabled:bg-blue-400"
        >
          {loading ? "Processing..." : "Get My Token"}
        </motion.button>
      </div>
      <footer className="mt-auto py-6 text-center">
  <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
    Securely Powered by <span className="text-blue-600">Digiflow-Skip Systems</span>
  </p>
</footer>
    </div>
  );
};

export default ScanPage;