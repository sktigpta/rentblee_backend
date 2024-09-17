// userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: false },
  password: { type: String, required: true },
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isMember: { type: Boolean, default: false },
  location: { type: Object },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String },
  email_verified: { type: Boolean, default: false },
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
    return next();
  } catch (error) {
    return next(error);
  }
});


//jwt webtoken Authentication or Authorisation
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign({

      userID: this._id.toString(),
      email: this.email,
      isAdmin: this.isAdmin,

    },

      process.env.JWT_SIGNATURE_SECRET_KEY,
      {
        expiresIn: "20d",
      }
    )
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
