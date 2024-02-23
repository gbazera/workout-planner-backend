const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const verificationTokenSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);