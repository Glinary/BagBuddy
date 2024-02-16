const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 7;

const usersSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  bags: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Bags",
    },
  ],
  itemGallery: {
    type: mongoose.Types.ObjectId,
    required: false,
  }
});

usersSchema.pre('save', async function (next){
  const user = this;

  if (!user.isModified('password'))
      // `return next();` will make sure 
      // the rest of this function doesn't run
      return next(); 

  try {
      // generate random salt
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR); 
      // produce the hashed value
      const hash = await bcrypt.hash(user.password, salt);
      // replace user's password with the hashed value
      user.password = hash;
      next(); // continue to the next middleware function
  } catch (err) {
      console.error(err);
      return next(err);
  }
});

usersSchema.method("comparePW", function (attemptPW) {
  return bcrypt.compare(attemptPW, this.password);
});

module.exports = mongoose.model("Users", usersSchema);