const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    tokens: [{
      token: {
        type: String,
        required: true,
      },
    }],
  },
  { timestamps: true }
);

userSchema.virtual('plants', {
  ref: 'Plant',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.statics.findByCreds = async (email, password) => {

  const user = await User.findOne({email});

  if (!user) {
    throw new Error('Unable to login');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error('Unable to login');
  }

  return user;
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();

  delete user.password;
  delete user.tokens;

  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({token});
  await user.save();

  return token;
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