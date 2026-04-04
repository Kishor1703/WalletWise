import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, User, Lock, Eye, EyeOff } from 'lucide-react';
import MyImage from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('https://walletwise-backend-ls6d.onrender.com/api/auth/register', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      setSuccess('Successfully registered!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      const serverMessage = error.response?.data?.message;

      if (serverMessage) {
        setError(serverMessage);
      } else if (error.response?.status >= 500) {
        setError('The server is having trouble right now. Please try again in a moment.');
      } else {
        setError('Registration failed. Please try again.');
      }

      console.error('Registration error:', serverMessage || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black'
          : 'bg-gradient-to-br from-sky-100 via-indigo-100 to-cyan-100'
      }`}
    >
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-5 right-5 bg-white/20 hover:bg-white/30 border border-white/25 backdrop-blur p-2 rounded-full transition"
      >
        {darkMode ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-slate-700" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border ${
          darkMode ? 'bg-gray-900 text-white border-gray-700/70' : 'bg-white text-gray-800 border-white/70'
        }`}
      >
        <div
          className={`relative flex flex-col items-center justify-center p-10 ${
            darkMode
              ? 'bg-gradient-to-br from-indigo-700 to-blue-900'
              : 'bg-gradient-to-br from-indigo-600 to-sky-600'
          } text-white`}
        >
          <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-16 -bottom-14 h-48 w-48 rounded-full bg-cyan-300/20 blur-2xl" />
          <img src={MyImage} alt="WalletWise Logo" className="w-32 mb-6 rounded-2xl shadow-lg z-10" />
          <h1 className="text-4xl font-extrabold mb-2 z-10">WalletWise</h1>
          <p className="text-center text-white/85 max-w-xs z-10">
            Start managing your money smarter.
            Create your account today.
          </p>
        </div>

        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            Join WalletWise and track your personal transactions easily.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full p-4 pl-11 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-4 pl-11 pr-12 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="rounded-xl border border-red-300/50 bg-red-100/40 text-red-600 px-4 py-3 text-sm">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl border border-green-300/50 bg-green-100/40 text-green-700 px-4 py-3 text-sm">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 rounded-xl font-semibold text-white transition bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center mt-6`}>
            Already registered?
            <Link to="/login" className="text-blue-500 font-semibold ml-1 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
