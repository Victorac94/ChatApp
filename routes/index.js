var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Message = require("../models/message"),
    User = require("../models/user");

const arrayColors = ['#074ab7', '#4a07b7', '#ae07b7', '#b70707', '#d65206', '#c6a007', '#a9c607', '#59c607', '#07c633', '#07c6b2'];

//Putting the routes inside this function will allow us to use socket.io in these routes
var returnRouter = function(io) {
    //Show index page
    router.get("/", (req, res) => {
        Message.find({}, (error, foundMsgs) => {
            if (error) console.log(error);
            else {
                res.render("index", { foundMsgs: foundMsgs });
            }
        });
    });

    //Add message
    router.post("/", (req, res) => {
        //Get the model of the user that wrote the message
        User.findOne({ username: req.body.username }, function(err, foundUser) {
            if (err) console.log(err);
            else {
                var createMessage = {
                    username: foundUser.username,
                    userColor: foundUser.color,
                    message: req.body.message
                };
                //Add the message to the DB
                Message.create(createMessage, (err, newMessage) => {
                    if (err) {
                        console.log("Couldn't create the comment");
                    }
                    else {
                        io.emit("chat", newMessage);
                        //req.body contains the text message and the user who wrote it.
                        //req.user is the user that is currently logged in (the one who's viewing all the messages)
                        //Both things do not have to necessarily match
                        return;
                    }
                });
            }
        });
    });

    //Handle register
    router.post("/register", (req, res) => {
        if (req.body.password !== req.body.confirm) {
            return res.redirect("back");
        }

        //Pick a random color from the array colorArray
        var randNumb = Math.floor(Math.random() * arrayColors.length);
        var randColor = arrayColors[randNumb];

        var newUser = {
            username: req.body.username,
            color: randColor
        };

        User.register(newUser, req.body.password, (error, user) => {
            if (error) console.log(error);
            else {
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/");
                });
            }
        });
    });

    //Handle login
    router.post("/login", passport.authenticate("local", {
        successRedirect: "back",
        failureRedirect: "back"
    }), (req, res) => {});

    //Handle logout
    router.get("/logout", (req, res) => {

        console.log("deslogeado");
        req.logout();
        res.redirect("/");
    });

    return router;
};

module.exports = returnRouter;
