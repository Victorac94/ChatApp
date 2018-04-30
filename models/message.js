var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    username: String,
    userColor: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Message", messageSchema);
