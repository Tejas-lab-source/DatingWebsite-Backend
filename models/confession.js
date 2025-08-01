const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // Link to the User who posted
    required: true
  },
  confession: {
    type: String,
    required: true,
    maxlength: 500     // Limit confession text
  },
  isAnonymous: {
    type: Boolean,
    default: false     // true = hide username
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'        // Users who liked this confession
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Confession', confessionSchema);
