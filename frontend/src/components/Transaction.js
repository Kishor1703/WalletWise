import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Trash2, LogOut } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('income');
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
        const res = await axios.get('https://wallet-wise-one.vercel.app/api/transactions', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://wallet-wise-one.vercel.app/api/transactions',
        { amount, category, type, description, person },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTransactions([...transactions, res.data]);
      setAmount('');
      setCategory('');
      setType('income');
      setDescription('');
      setPerson('');
    } catch (error) {
      setError('Error adding transaction');
      console.error(error.response?.data?.message || error.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://wallet-wise-one.vercel.app/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center text-2xl font-semibold text-blue-600 animate-pulse">
          Loading transactions...
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
        <h2 className="text-4xl font-extrabold text-white text-center tracking-tight">
            WalletWise
          </h2>
          <h2 className="text-2xl font-extrabold text-white text-center tracking-tight">
            Transaction Tracker
          </h2>
        </div>

        <div className="p-8 space-y-8">
          <form 
            onSubmit={handleSubmit} 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl shadow-inner"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="lending">Lending</option>
                <option value="returning">Returning</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Person's Name</label>
              <input
                type="text"
                placeholder="Enter person's name"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Add Transaction
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
              People
            </h3>

            {Object.keys(groupedTransactions).map((personName) => {
              const { transactions, lending, returning } = groupedTransactions[personName];
              const balance = lending - returning;

              return (
                <div 
                  key={personName} 
                  className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden"
                >
                  <div 
                    onClick={() => setSelectedPerson(selectedPerson === personName ? null : personName)}
                    className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition duration-300"
                  >
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{personName}</h4>
                      <span className={`text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {balance > 0 ? `${balance} to be returned` : 'Settled'}
                      </span>
                    </div>
                    {selectedPerson === personName ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                  </div>

                  {selectedPerson === personName && (
                    <div className="bg-gray-50 p-4 space-y-3">
                      {transactions.map((transaction) => (
                        <div 
                          key={transaction._id} 
                          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div>
                            <span className="font-medium text-gray-800">{transaction.amount}</span>
                            <span className="text-sm text-gray-600 ml-2">
                              {transaction.category} ({transaction.type})
                              {transaction.description && `: ${transaction.description}`}
                            </span>
                          </div>
                          <button 
                            onClick={() => deleteTransaction(transaction._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition duration-300"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default Transactions;