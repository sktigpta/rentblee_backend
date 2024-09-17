
const { Schema, model } = require('mongoose')

const SeenSchema = new Schema({
  userId: {
    type: String,
    required: true
  },

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
    required: true
  },

  isSeen: {
    type: Boolean,
    default: false,
  }
});

const Seen = new model('Seen', SeenSchema);

module.exports = Seen;
