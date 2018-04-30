var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
// Message = require("./message.js"),
// messageSchema = mongoose.model("Message").schema;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    color: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
