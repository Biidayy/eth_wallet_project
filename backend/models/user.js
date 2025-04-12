const mongoose = require('mongoose');

// Schema cho người dùng
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
  privateKey: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
