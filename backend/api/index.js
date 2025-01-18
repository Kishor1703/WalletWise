const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const cron=require('node-cron');
const app = express();



// Middleware
app.use(bodyParser.json());

// Allow specific origins
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
app.options('*', cors(corsOptions)); // Handle preflight requests



// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/transactions', require('../routes/transactions'));

// Database connection
mongoose.connect('mongodb+srv://kishor:kishor2004@user.fzngpux.mongodb.net/?retryWrites=true&w=majority&appName=user', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.PASSWORD, // Your email password
  },
});

// Schedule a weekly task
cron.schedule('0 9 * * *', async () => {
  // Logic to fetch pending lendings
  const transactions = await Transaction.find({ type: 'lending', isPaid: false });

  transactions.forEach((transaction) => {
    const message = `Reminder: You have to return Rs.${transaction.amount} to ${transaction.lenderName}.`;

    // Send email (or other notifications like SMS)
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: transaction.borrowerEmail, // Email of the borrower
        subject: 'Weekly Reminder',
        text: message,
      },
      (err, info) => {
        if (err) {
          console.error(`Failed to send email to ${transaction.borrowerEmail}:`, err);
        } else {
          console.log(`Reminder sent to ${transaction.borrowerEmail}:`, info.response);
        }
      }
    );
  });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
