const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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
      avatar: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
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
      auth: {
        type: String,
        default:0,
      },
      userId: {
        type: String,
        ref: "User",
        required: true,
      },
      privacy: {
        type: Boolean,
        default: false,
      },
      needToChangePass: {
        type: Boolean,
        default: false
      }, 
      followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
      toJSON: {
        transform: (doc, ret) => {
          delete ret.password;
          return ret;
        },
      },
      toObject: {
        transform: (doc, ret) => {
          delete ret.password;
          return ret;
        },
      },
    }
  );
  
  // Add `validPassword` method to schema
  userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  userSchema.methods.validEmail = function (email) {
    return email == this.email;
  };
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;
  