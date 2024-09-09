const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config/config');

const app = express();

// Middleware
app.use(bodyParser.json());

// Set CORS before any routes
const corsOptions = {
  origin: '*', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials if required
};

app.use(cors(corsOptions));

// Body parser middleware (after CORS)
app.use(express.json());


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
