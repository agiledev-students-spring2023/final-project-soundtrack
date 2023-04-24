const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const socialSchema = new Schema(
    {
        // friendRequestId: {
        //     type: String,
        //     required: true,
        // },

        fromUserId: {
            type: String,
            ref: "User",
            required: true,
        },

        toUserId: {
            type: String,
            ref: "User",
            required: true,
        }
    }
);

const Social = mongoose.model('Social', socialSchema);
module.exports = Social;