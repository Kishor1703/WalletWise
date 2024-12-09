// transactions.js (route)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Add transaction
router.post('/', auth, async (req, res) => {
    const { amount, category, type, description, person } = req.body;
    try {
        const newTransaction = new Transaction({
            user: req.user.id,
            amount,
            category,
            type,
            description,
            person
        });
        const transaction = await newTransaction.save();
        console.log(`New transaction added for user ${req.user.id}:`, transaction);
        res.json(transaction);
    } catch (err) {
        console.error(`Error adding transaction for user ${req.user.id}:`, err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        console.log(`Delete request received for ID: ${req.params.id}`);
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            console.log('Transaction not found');
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        if (transaction.user.toString() !== req.user.id) {
            console.log('Unauthorized user');
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await transaction.remove();
        res.json({ msg: 'Transaction removed successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err.message);
        res.status(500).send('Server error');
    }
});

// Get all transactions
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        console.log(`Fetched ${transactions.length} transactions for user ${req.user.id}`);
        res.json(transactions);
    } catch (err) {
        console.error(`Error fetching transactions for user ${req.user.id}:`, err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

