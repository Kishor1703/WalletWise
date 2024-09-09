const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config/config');

const app = express();

// Middleware
app.use(bodyParser.json());


const corsOptions = {
  origin: 'https://wallet-wise-one.vercel.app', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true // Enable credentials (if needed)
};

app.use(cors(corsOptions));



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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
