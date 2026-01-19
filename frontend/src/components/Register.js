import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyImage from '../assets/logo.png';
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  // const [darkMode, setDarkMode] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('  https://walletwise-backend-ls6d.onrender.com/api/auth/register', { username, password });
      localStorage.setItem('token', res.data.token);
      setSuccess('Successfully registered!');
      setTimeout(() => {
        navigate('/login');
      }, 1000); // Redirect to login page after 2 seconds
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', error.response?.data?.message || error.message);
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
        className="absolute top-5 right-30 bg-black/20 backdrop-blur px-4 py-2 rounded-full text-lg"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>


      {/* Main Card */}
      <div
        className={`w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-colors duration-300
        ${darkMode ? "bg-gray-900" : "bg-white"}`}
      >

        {/* 🔵 LEFT – BRANDING */}
        <div
          className={`flex flex-col items-center justify-center p-10 transition-colors duration-300
          ${darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
            }`}
        >
          <img
            src={MyImage}
            alt="WalletWise Logo"
            className="w-32 mb-6 drop-shadow-lg"
          />

          <h1 className="text-4xl font-extrabold mb-2">WalletWise</h1>
          <p className="text-center max-w-xs text-white/80">
            Start managing your money smarter 💰
            Create your account today.
          </p>
        </div>

        {/* ⚪ RIGHT – REGISTER FORM */}
        <div className="p-10 flex flex-col justify-center">

          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Create your account
          </h2>

          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
            Join WalletWise and take control of your finances.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full p-4 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none
                ${darkMode
                    ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border border-gray-300"
                  }`}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                👤
              </span>
            </div>

            {/* Email */}
            {/* <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-4 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none
                ${darkMode
                    ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border border-gray-300"
                  }`}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                📧
              </span>
            </div> */}

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-4 pl-12 pr-12 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none
                ${darkMode
                    ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border border-gray-300"
                  }`}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full p-4 rounded-xl font-semibold text-white transition
              bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Register
            </button>
          </form>

          {/* Messages */}
          {error && (
            <p className="text-center text-red-500 mt-4 font-medium">
              {error}
            </p>
          )}

          {success && (
            <p className="text-center text-green-500 mt-4 font-medium">
              {success}
            </p>
          )}

          {/* Login Redirect */}
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center mt-6`}>
            Already registered?
            <a href="/login" className="text-blue-500 font-semibold ml-1 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );


};

export default Register;
