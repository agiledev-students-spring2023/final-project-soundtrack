const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const locationSchema = new Schema(
  {
    locationName: {
      type: Object,
      required: true,
    },
    songTitle: {
        type: Object,
        required: true,
      },
  },
);

const Post = mongoose.model('Location', locationSchema);
module.exports = Post;

