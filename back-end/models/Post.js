const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

