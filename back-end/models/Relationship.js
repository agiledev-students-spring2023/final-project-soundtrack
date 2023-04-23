const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relationshipSchema = new Schema(
    {
        userAId: {
            type: String,
            ref: "User",
            required: true
        },

        userBId: {
            type: String,
            ref: "User",
            required: true
        }
    }
);

const Relationship = mongoose.model('Relationship', relationshipSchema);
module.exports = Relationship;