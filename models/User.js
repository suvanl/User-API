const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    discriminator: {
        type: String,
        required: true,
        trim: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

UserSchema.plugin(timestamp);

const User = mongoose.model("User", UserSchema);

module.exports = User;
