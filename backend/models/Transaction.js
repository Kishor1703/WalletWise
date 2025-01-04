const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: String,
  type: { type: String, enum: ['income', 'expense', 'lending', 'returning'], required: true },
  description: String,
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  person: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
