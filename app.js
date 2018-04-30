var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    http = require("http").Server(app),
    io = require("socket.io")(http);

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

//REQUIRING ROUTES
var indexRoutes = require("./routes/index")(io);

var url = process.env.DATABASEURL || "mongodb://localhost/chatapp";
mongoose.connect(url);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "heyyyyyy que pasa",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//Middleware that runs the function on every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user; //currentUser will be a var available on every view
    next();
});

app.use(indexRoutes);

http.listen(process.env.PORT, process.env.IP, function() {
    console.log("Chat app server is running...");
});
