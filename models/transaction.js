const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userName: String,
  accountNumber: String,
  ifscCode: String,
  phoneNumber: String,
  email: String,
  recipientName: String,
  recipientAccountNumber: String,
  recipientIfscCode: String,
  panNumber: String,
  accountType: {
    type: String,
    enum: ['Current Account', 'Savings Account'],
    required: function() { return this.type === 'transfer'; }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);