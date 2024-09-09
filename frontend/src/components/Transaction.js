import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';

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
        const res = await axios.get('https://wallet-wise-g6b2.vercel.app/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched transactions:', res.data); // Debugging
        setTransactions(res.data);
      } catch (error) {
        console.error('Fetch transactions error:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch transactions.');
        }
      }
      finally {
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
      setAmount('');
      setCategory('');
      setType('income');
      setDescription('');
      setPerson('');
    } catch (error) {
      setError('Error adding transaction');
      console.error('Transaction error:', error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.person]) {
      acc[transaction.person] = [];
    }
    acc[transaction.person].push(transaction);
    return acc;
  }, {});

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container1'>
      <h2>Transactions</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select className='select' value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Person's Name"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          required
        />
        <button type="submit" className='button1'>Add Transaction</button>
      </form>

      <h3>People</h3>
      <ul>
        {Object.keys(groupedTransactions).map((personName) => (
          <li key={personName}>
            <button 
              onClick={() => setSelectedPerson(selectedPerson === personName ? null : personName)}
              className="person-button"
            >
              {personName}
            </button>
            {selectedPerson === personName && (
              <ul>
                {groupedTransactions[personName].map((transaction) => (
                  <li key={transaction._id}>
                    {transaction.amount} - {transaction.category} ({transaction.type})
                    {transaction.description && `: ${transaction.description}`}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Transactions;
