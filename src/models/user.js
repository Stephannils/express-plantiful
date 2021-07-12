const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Please use a valid email address');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function() {
  const user = this.toObject();

  delete user.password;
  return user;
};

userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;