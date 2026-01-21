import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyImage from '../assets/logo.png';
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  // const [darkMode, setDarkMode] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/transactions');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request
    try {
      const res = await axios.post('https://walletwise-backend-ls6d.onrender.com/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);  // Store token in localStorage
      navigate('/transactions');  // Redirect to transactions page
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('User does not exist. Please register.');
      } else if (error.response && error.response.status === 401) {
        setErrorMessage('Incorrect password. Please try again.');
      } else {
        setErrorMessage('Login error. Please check username and password.');
      }
    }
    finally {
      setLoading(false);  // Set loading to false after the request completes
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300
        ${darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200"
        }`}
    >
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-30 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-lg"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>


      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
      >

        {/* LEFT – LOGO */}
        <div
          className={`flex flex-col items-center justify-center p-10 transition-colors duration-300
          ${darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
            }`}
        >
          <img src={MyImage} alt="WalletWise" className="w-32 mb-6" />
          <h1 className="text-4xl font-extrabold mb-2">WalletWise</h1>
          <p className="text-center text-blue-100 max-w-xs">
            Manage your money smarter 💰
            Track, save, and grow effortlessly.
          </p>
        </div>

        {/* RIGHT – FORM */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Login to your account</h2>
          <p className="text-gray-400 mb-6">
            Welcome back! Please enter your details.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-4 pl-12 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none
    ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300"}`}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2">👤</span>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 pl-12 pr-12 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none
    ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300"}`}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2">🔒</span>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
              >
                {showPassword ? "🫣" : "😃"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {errorMessage && (
            <div className="mb-4 text-red-500 font-medium text-center">
              {errorMessage}
            </div>
          )}
          <p className="text-center mt-6 text-gray-400">
            No account?
            <a href="/register" className="text-blue-500 font-semibold ml-1">
              Register here
            </a>
          </p>
        </div>


      </motion.div>
    </div>
  );

};

export default Login;
