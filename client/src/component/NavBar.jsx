import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("NavBar mounted, checking auth state...");
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    
    console.log("Initial localStorage values:", {
      token: token ? "exists" : "not found",
      userName: storedName || "not found"
    });
    
    if (token && storedName) {
      console.log("Found both token and name in localStorage");
      setIsLoggedIn(true);
      setUserName(storedName);
    } else {
      console.log("Missing token or name, attempting to fetch user data");
      // If no token or name, try to fetch user data
      const fetchUserData = async () => {
        try {
          console.log("Fetching user data from /api/auth/me");
          const response = await axios.get("https://funddaddy-backend.onrender.com/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("User data response:", response.data);
          setUserName(response.data.name);
          localStorage.setItem("userName", response.data.name);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          console.error("Error response:", error.response);
          // If token is invalid, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          setIsLoggedIn(false);
          setUserName("");
        }
      };
      
      if (token) {
        fetchUserData();
      } else {
        console.log("No token found, user is not logged in");
      }
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    setIsDropdownOpen(false);
    navigate("/");
  };

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-white flex items-center justify-between px-8 py-3 shadow-sm">
      <div className="flex items-center">
        <Link to="/">
          <span className="text-2xl font-bold">
            <span className="text-sky-500">Fund</span>
            <span className="text-purple-500">Daddy</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center mx-8">
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-[320px]">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search campaigns..."
            className="outline-none bg-transparent w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <Link to="/campaigns" className="font-semibold text-gray-900 hover:text-sky-500 transition">Discover</Link>
        <a 
          href="#how-it-works" 
          onClick={scrollToHowItWorks}
          className="font-semibold text-gray-900 hover:text-sky-500 transition"
        >
          How It Works
        </a>
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 font-semibold text-gray-900 hover:text-sky-500 transition"
            >
              {userName}
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-800 hover:bg-sky-50 hover:text-sky-500 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-sky-50 hover:text-sky-500 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="font-normal text-gray-900 hover:text-sky-500 transition">Log In</Link>
        )}
        <Link 
          to="/create-campaign" 
          className="ml-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-xl transition"
        >
          Start a Campaign
        </Link>
      </div>
    </nav>
  );
}