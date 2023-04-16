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
      },
    },
    {
      // Add `toJSON` and `toObject` transform to remove password field
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
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;
  