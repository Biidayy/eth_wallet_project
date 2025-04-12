const mongoose = require('mongoose');

// Schema cho lịch sử giao dịch
const transactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionHash: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  status: { type: String, required: true },
  fee: { type: String, required: true },
  gasUsed: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
