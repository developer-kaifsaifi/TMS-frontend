import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", { email, password });

      if (res.data.success) {
        // 🔥 CRITICAL: Backend 'authToken' bhej raha hai
        const token = res.data.authToken; 
        const business = res.data.business;

        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("businessData", JSON.stringify(business));
          console.log("Login Success: Token Saved");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Business Login</h2>
        <input type="email" placeholder="Email" className="w-full p-3 mb-4 border rounded-xl" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded-xl" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">Login</button>
      </form>
    </div>
  );
};

export default Login;