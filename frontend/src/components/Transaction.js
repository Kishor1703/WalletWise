import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChevronDown, ChevronUp, Trash2, LogOut } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';

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
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalReturning = transactions
    .filter((t) => t.type === 'returning')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const chartData = [
    { name: 'Money Given', value: totalLending-totalReturning },
    { name: 'Money Returned', value: totalReturning },
  ];

  const hasChartData = chartData.some(item => item.value > 0);

  const returned = totalReturning;
const pending = Math.max(totalLending - totalReturning, 0);

const donutData = [
  { name: 'Returned', value: returned },
  { name: 'Pending', value: pending },
];

const DONUT_COLORS = ['#00C897', '#FF4D4F'];
const hasDonutData = donutData.some(d => d.value > 0);

const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200">
        <p className="text-blue-700 text-2xl font-semibold animate-pulse">
          Loading transactions...
        </p>
      </div>
    );
  }


 return (
  <div
    className={`min-h-screen p-4 sm:p-6 transition-colors duration-300
      ${darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
        : "bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 text-gray-800"
      }`}
  >

    {/* Header */}
    <div className="max-w-7xl mx-auto mb-6 relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl p-6 text-center shadow-lg">
      <h1 className="text-3xl font-extrabold">WalletWise</h1>
      <p className="text-indigo-100">Smart Transaction Tracker</p>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-lg"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </div>

    {/* MAIN GRID */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT COLUMN */}
      <div className="space-y-6">

        {/* Donut Chart */}
        <div
          className={`rounded-3xl shadow-lg p-6
            ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Overall Summary
          </h2>

          <div className="w-full h-[320px] flex justify-center items-center">
            {hasDonutData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {donutData.map((_, index) => (
                      <Cell key={index} fill={DONUT_COLORS[index]} />
                    ))}
                  </Pie>

                  {/* Center text */}
                  <text
                    x="50%"
                    y="48%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-sm font-semibold ${
                      darkMode ? "fill-gray-300" : "fill-gray-700"
                    }`}
                  >
                    Pending
                  </text>
                  <text
                    x="50%"
                    y="58%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-lg font-bold fill-red-500"
                  >
                    ₹{pending}
                  </text>

                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No data available</p>
            )}
          </div>
        </div>

        {/* Summary Numbers */}
        <div
          className={`rounded-3xl shadow-lg p-6 text-center space-y-2
            ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <p className="text-lg">
            Total Given: <span className="font-semibold">₹{totalLending}</span>
          </p>
          <p className="text-lg">
            Total Returned: <span className="font-semibold">₹{totalReturning}</span>
          </p>
          <p
            className={`text-xl font-bold ${
              totalLending - totalReturning > 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            Net: ₹{totalLending - totalReturning}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">

        {/* Add Transaction */}
        <div
          className={`rounded-3xl shadow-lg p-6
            ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Add Transaction
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className={`p-3 rounded-xl border outline-none
                ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"}`}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`p-3 rounded-xl border outline-none
                ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"}`}
            >
              <option value="lending">Money Given</option>
              <option value="returning">Money Returned</option>
            </select>

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`p-3 rounded-xl border outline-none
                ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"}`}
            />

            <input
              type="text"
              placeholder="Person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
              className={`p-3 rounded-xl border outline-none sm:col-span-2
                ${darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"}`}
            />

            <button
              type="submit"
              className="sm:col-span-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              Add Transaction
            </button>
          </form>
        </div>
        {/* Transactions */}
<div
  className={`rounded-3xl shadow-lg p-6
    ${darkMode ? "bg-gray-900" : "bg-white"}`}
>
  <h2 className="text-xl font-semibold mb-4">
    Transactions
  </h2>

  {Object.entries(groupedTransactions).length === 0 && (
    <p className="text-center text-gray-400">
      No transactions yet
    </p>
  )}

  {Object.entries(groupedTransactions).map(([person, data]) => (
    <div
      key={person}
      className={`mb-4 border rounded-2xl p-4
        ${darkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      {/* Person Header */}
      <div
        onClick={() =>
          setSelectedPerson(selectedPerson === person ? null : person)
        }
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="font-semibold text-lg">
          {person}
        </h3>
        {selectedPerson === person ? <ChevronUp /> : <ChevronDown />}
      </div>

      {/* Expanded Section */}
      {selectedPerson === person && (
        <div className="mt-4 space-y-3">

          {/* Individual Transactions */}
          {data.transactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  ₹{t.amount}
                  <span className="text-sm text-gray-400">
                    {" "}• {t.type === "lending" ? "Given" : "Returned"}
                  </span>
                </p>
                {t.description && (
                  <p className="text-sm text-gray-400">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteTransaction(t._id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Person Summary */}
          <div
            className={`pt-3 border-t text-sm
              ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <p>Lent: ₹{data.lending}</p>
            <p>Returned: ₹{data.returning}</p>
            <p
              className={`font-semibold ${
                data.lending - data.returning > 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              Pending: ₹{data.lending - data.returning}
            </p>
          </div>

        </div>
      )}
    </div>
  ))}
</div>

      </div>
    </div>
    {/* Logout */}
<div
  className={`flex justify-center rounded-3xl shadow-lg p-6
    `}
>
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl
               hover:bg-red-600 transition font-semibold"
  >
    <LogOut size={18} />
    Logout
  </button>
</div>
  </div>
  

);




};

export default Transactions;
