import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('https://wallet-wise-g6b2.vercel.app/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center text-2xl font-semibold text-blue-600 animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center text-2xl font-semibold text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-4xl font-extrabold text-white text-center tracking-tight">User Profile</h2>
        </div>

        <div className="p-8 space-y-8">
          {user && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Name</h3>
                <p className="text-2xl font-bold text-gray-700">{user.name}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                <p className="text-2xl font-bold text-gray-700">{user.email}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Phone</h3>
                <p className="text-2xl font-bold text-gray-700">{user.phone}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Joined</h3>
                <p className="text-2xl font-bold text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
