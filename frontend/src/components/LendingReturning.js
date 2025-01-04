import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LendingReturning = () => {
  const [amount, setAmount] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [type, setType] = useState('lending');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://wallet-wise-g6b2.vercel.app/api/transactions',
        {
          amount: Number(amount),
          person: borrowerName,
          email: borrowerEmail,
          type,
          description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Transaction recorded: ${res.data.message}`);
      setAmount('');
      setBorrowerName('');
      setBorrowerEmail('');
      setType('lending');
      setDescription('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating transaction');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Lending & Returning</h2>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Borrower's Name</label>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Enter borrower's name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Borrower's Email</label>
            <input
              type="email"
              value={borrowerEmail}
              onChange={(e) => setBorrowerEmail(e.target.value)}
              placeholder="Enter borrower's email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="lending">Lending</option>
              <option value="returning">Returning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        <button
          onClick={() => navigate('/transactions')}
          className="mt-4 w-full py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400"
        >
          Back to Transactions
        </button>
      </div>
    </div>
  );
};

export default LendingReturning;
