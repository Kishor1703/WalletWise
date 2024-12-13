import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
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
        const res = await axios.get('https://wallet-wise-g6b2.vercel.app/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (error) {
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
        'https://wallet-wise-g6b2.vercel.app/api/transactions',
        { amount, category, type, description, person },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions([...transactions, res.data]);
      resetForm();
    } catch (error) {
      setError('Error adding transaction');
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setType('income');
    setDescription('');
    setPerson('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://wallet-wise-g6b2.vercel.app/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
    } catch (error) {
      alert('Error deleting transaction.');
    }
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.person]) {
      acc[transaction.person] = [];
    }
    acc[transaction.person].push(transaction);
    return acc;
  }, {});

  const calculateRemainingAmount = (personName) => {
    return groupedTransactions[personName].reduce((total, transaction) => {
      return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
    }, 0);
  };

  if (loading) return (<div className="text-center text-gray-600">Loading transactions...</div>);
  if (error) return (<div className="text-center text-red-600">{error}</div>);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900'>
      <header className='flex items-center justify-between w-full py-6 bg-white shadow-md px-4'>
        <div className='flex items-center'>
          <img src={logo} alt='Logo' className='w-16 h-16' />
          <h1 className='ml-4 text-3xl font-bold'>Wallet Wise</h1>
        </div>
        <button onClick={handleLogout} 
          className='p-2 bg-red-500 text-white rounded hover:bg-red-400 transition'>Logout</button>
      </header>

      <div className='w-full max-w-4xl p-6'>
        <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Add a Transaction</h2>

          <input type='number' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} required 
            className='w-full p-3 mb-4 border rounded bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <input type='text' placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} 
            className='w-full p-3 mb-4 border rounded bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />

<select value={type} onChange={(e) => setType(e.target.value)} 
  className='w-full p-3 mb-4 border rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
  <option value='Money Gave'>Money Gave</option>
  <option value='Return'>Return</option>
</select>

          <input type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} 
            className='w-full p-3 mb-4 border rounded bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <input type='text' placeholder="Person's Name" value={person} onChange={(e) => setPerson(e.target.value)} required 
            className='w-full p-3 mb-4 border rounded bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <button type='submit' 
            className='w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition'>Add Transaction</button>
        </form>

        <h3 className='text-2xl font-semibold mb-4'>People</h3>
        <ul className="bg-white rounded-lg p-6 shadow-lg">
          {Object.keys(groupedTransactions).map((personName) => (
            <li key={personName} className='mb-4'>
              <button 
                onClick={() => setSelectedPerson(selectedPerson === personName ? null : personName)}
                className='w-full text-left p-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition'>
                {personName} - Remaining Amount: {calculateRemainingAmount(personName)}
              </button>
              {selectedPerson === personName && (
                <ul className='mt-2'>
                  {groupedTransactions[personName].map((transaction) => (
                    <li key={transaction._id} className='py-2 flex justify-between'>
                      <span>{transaction.amount} - {transaction.category} ({transaction.type})</span>
                      {/* <button 
                        onClick={() => handleDelete(transaction._id)} 
                        className='p-2 bg-red-500 text-white rounded hover:bg-red-400'>Delete</button> */}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Transactions;
