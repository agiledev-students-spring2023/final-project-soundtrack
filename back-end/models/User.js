const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    spotifyUser: {
      type: String,
      default: 0,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
      }  
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;

