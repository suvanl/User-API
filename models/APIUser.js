const mongoose = require("mongoose");

const APIUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

const APIUser = mongoose.model("APIUser", APIUserSchema);
module.exports = APIUser;
