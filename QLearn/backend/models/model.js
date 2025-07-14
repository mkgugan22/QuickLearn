const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
 role: { type: String, default: 'Admin', enum: ['Admin', 'Student']} 
});

module.exports = mongoose.model('model', userSchema);