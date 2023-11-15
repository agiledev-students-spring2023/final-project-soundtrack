const mongoose = require('mongoose');
const { Schema } = mongoose;

const followingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Following = mongoose.model('Following', followingSchema);

module.exports = { Following };