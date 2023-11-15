const mongoose = require('mongoose');
const { Schema } = mongoose;

const followerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
const Follower = mongoose.model('Follower', followerSchema);

module.exports = { Follower};
