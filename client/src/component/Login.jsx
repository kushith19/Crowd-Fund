import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BlobBackground from "./BlobBackground";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log("Attempting login with:", formData);
    
    try {
      const response = await axios.post("https://funddaddy-backend.onrender.com/api/auth/login", formData);
      console.log("Full login response:", response);
      console.log("Login response data:", response.data);
      
      if (!response.data.token) {
        throw new Error("No token received from server");
      }
      
      // Store the user's name from the response
      if (response.data.user && response.data.user.name) {
        localStorage.setItem("userName", response.data.user.name);
      } else {
        throw new Error("No user name received from server");
      }
      
      localStorage.setItem("token", response.data.token);
      console.log("Stored in localStorage:", {
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("userName")
      });
      
      navigate("/campaigns");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      setError(error.response?.data?.error || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <BlobBackground />
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform hover:scale-105 transition duration-300 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-sky-500">Fund</span>
            <span className="text-purple-500">Daddy</span>
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Log in to your account.</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-sky-500 hover:text-sky-700 transition">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-sky-500 text-white font-semibold py-2 rounded-lg transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-600'
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-sky-500 hover:text-sky-700 font-semibold transition">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
