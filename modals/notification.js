const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  notificationId: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return Date.now().toString() + Math.floor(Math.random() * 1000);
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
