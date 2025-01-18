require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Transaction = require('../models/Transaction'); // ✅ Fixed
const app = express();

// Middleware
app.use(bodyParser.json());

// CORS Setup
const allowedOrigins = ['http://localhost:3000', 'https://wallet-wise-one.vercel.app'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Database connection
mongoose.connect('mongodb+srv://kishor:kishor2004@user.fzngpux.mongodb.net/?retryWrites=true&w=majority&appName=user', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,  // ✅ Using .env
    pass: process.env.PASSWORD,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Error with transporter:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Cron Job: Every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  try {
    const transactions = await Transaction.find({ type: 'lending', isPaid: false });
    
    transactions.forEach((transaction) => {
      const message = `Reminder: You have to return Rs.${transaction.amount} to ${transaction.lenderName}.`;
      
      transporter.sendMail({
        from: process.env.EMAIL,
        to: transaction.borrowerEmail,
        subject: 'Weekly Reminder',
        text: message,
      }, (err, info) => {
        if (err) {
          console.error(`Failed to send email to ${transaction.borrowerEmail}:`, err);
        } else {
          console.log(`Reminder sent to ${transaction.borrowerEmail}:`, info.response);
        }
      });
    });

  } catch (err) {
    console.error('Error fetching transactions:', err);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
