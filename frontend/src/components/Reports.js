import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('https://wallet-wise-g6b2.vercel.app/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch transactions.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const totalLending = transactions.filter(t => t.type === 'lending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalReturning = transactions.filter(t => t.type === 'returning').reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate balance
  const balance = totalIncome - totalExpense + totalReturning - totalLending;


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center text-2xl font-semibold text-blue-600 animate-pulse">
          Loading report...
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
          <h2 className="text-4xl font-extrabold text-white text-center tracking-tight">Transaction Report</h2>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Total Income</h3>
              <p className="text-2xl font-bold text-green-600">Rs.{totalIncome}</p>
            </div>

            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Total Expense</h3>
              <p className="text-2xl font-bold text-red-600">Rs.{totalExpense}</p>
            </div>

            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Total Lending</h3>
              <p className="text-2xl font-bold text-yellow-600">Rs.{totalLending}</p>
            </div>

            <div className="bg-blue-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Total Returning</h3>
              <p className="text-2xl font-bold text-purple-600">Rs.{totalReturning}</p>
            </div>
          </div>

          {/* Displaying Balance */}
          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Total Balance</h3>
            <p className="text-2xl font-bold text-blue-600">Rs.{balance}</p>
          </div>
        
          {/* Go to Transactions Button */}
          <button
            onClick={() => navigate('/transactions')} // Adjust the route as needed
            className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition duration-300 mt-4"
          >
            Go to Transactions
          </button>

        </div>
      </div>
    </div>
  );
};

export default Report;
