import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChevronDown, ChevronUp, Trash2, LogOut } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('lending');
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
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
        const res = await axios.get('https://walletwise-backend-ls6d.onrender.com/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch transactions.');
          toast.error('Failed to fetch transactions.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://walletwise-backend-ls6d.onrender.com/api/transactions',
        { amount, category, type, description, person },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions([...transactions, res.data]);
      setAmount('');
      setCategory('');
      setType('lending');
      setDescription('');
      setPerson('');
      toast.success('Transaction added successfully.');
    } catch (error) {
      setError('Error adding transaction');
      toast.error('Error adding transaction.');
      console.error(error.response?.data?.message || error.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://walletwise-backend-ls6d.onrender.com/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
      toast.success('Transaction deleted successfully.');
    } catch (error) {
      toast.error('Error deleting transaction.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.info('Logged out successfully.');
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.person]) {
      acc[transaction.person] = { transactions: [], lending: 0, returning: 0 };
    }
    acc[transaction.person].transactions.push(transaction);
    if (transaction.type === 'lending') {
      acc[transaction.person].lending += transaction.amount;
    } else if (transaction.type === 'returning') {
      acc[transaction.person].returning += transaction.amount;
    }
    return acc;
  }, {});

  const totalLending = transactions
    .filter((t) => t.type === 'lending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReturning = transactions
    .filter((t) => t.type === 'returning')
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = [
    { name: 'Lending', value: totalLending },
    { name: 'Returning', value: totalReturning },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <p className="text-blue-600 text-2xl font-semibold animate-pulse">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center">
          <h1 className="text-3xl font-bold">WalletWise - Transaction Tracker</h1>
        </div>

        {/* Summary Chart */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Overall Summary</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div>
              <PieChart width={300} height={300}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
            <div className="text-gray-700">
              <p className="text-lg">Total Lending: ₹{totalLending}</p>
              <p className="text-lg">Total Returning: ₹{totalReturning}</p>
              <p
                className={`font-bold ${
                  totalLending - totalReturning > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                Net: ₹{totalLending - totalReturning}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="border px-4 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border px-4 py-2 rounded-md"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border px-4 py-2 rounded-md"
            >
              <option value="lending">Lending</option>
              <option value="returning">Returning</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border px-4 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
              className="border px-4 py-2 rounded-md col-span-2"
            />
            <button
              type="submit"
              className="col-span-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="p-6">
          {Object.entries(groupedTransactions).map(([person, data]) => (
            <div key={person} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div
                onClick={() =>
                  setSelectedPerson(selectedPerson === person ? null : person)
                }
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{person}</h3>
                {selectedPerson === person ? <ChevronUp /> : <ChevronDown />}
              </div>
              {selectedPerson === person && (
                <div className="mt-2">
                  {data.transactions.map((t) => (
                    <div key={t._id} className="flex justify-between items-center py-1">
                      <div>
                        <p className="text-gray-800">
                          ₹{t.amount} - {t.category}
                        </p>
                        {t.description && (
                          <p className="text-sm text-gray-500">{t.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTransaction(t._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Lent: ₹{data.lending}</p>
                    <p>Returned: ₹{data.returning}</p>
                    <p className={`font-semibold ${data.lending - data.returning > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Net: ₹{data.lending - data.returning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
