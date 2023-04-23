const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    userName:{
      type: String,
      ref: "User",
      required: true,
    },

    avatar:{
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
      required: true,
    },
    
    songTitle: {
      type: Object,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    privacy: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

