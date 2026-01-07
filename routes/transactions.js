const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.js');

router.post('/credit', async (req, res) => {
  try {
    const transaction = new Transaction({
      type: 'credit',
      amount: req.body.amount
    });
    await transaction.save();
    res.status(201).json({ message: 'Credit transaction saved successfully', transaction });
  } catch (error) {
    res.status(400).json({ message: 'Error saving credit transaction', error: error.message });
  }
});

router.post('/debit', async (req, res) => {
  try {
    const transaction = new Transaction({
      type: 'debit',
      amount: req.body.amount,
      userName: req.body.userName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email
    });
    await transaction.save();
    res.status(201).json({ message: 'Debit transaction saved successfully', transaction });
  } catch (error) {
    res.status(400).json({ message: 'Error saving debit transaction', error: error.message });
  }
});

router.post('/transfer', async (req, res) => {
  try {
    const transaction = new Transaction({
      type: 'transfer',
      amount: req.body.amount,
      recipientName: req.body.recipientName,
      recipientAccountNumber: req.body.recipientAccountNumber,
      recipientIfscCode: req.body.recipientIfscCode,
      panNumber: req.body.panNumber,
      accountType: req.body.accountType
    });
    await transaction.save();
    res.status(201).json({ message: 'Transfer transaction saved successfully', transaction });
  } catch (error) {
    res.status(400).json({ message: 'Error saving transfer transaction', error: error.message });
  }
});

module.exports = router;