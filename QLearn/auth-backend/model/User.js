const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // should be hashed
  role: { type: String, enum: ['student', 'principal'], required: true }
}, { collection: 'user' });

module.exports = mongoose.model('User', userSchema);
