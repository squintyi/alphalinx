var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Partner  = require("./models/partner"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    partnerRoutes = require("./routes/partners"),
    indexRoutes      = require("./routes/index")

var port = process.env.PORT || 31812;
// var url = DATABASEURL || "mongodb://localhost/alphalinx";
// var DATABASEURL = "mongodb://eklinx2017:p%40ndalinx88@ds031812.mlab.com:31812/alphalinx";

mongoose.connect("mongodb://eklinx2017:p%40ndalinx88@ds031812.mlab.com:31812/alphalinx");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Panda express number 1!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/partners", partnerRoutes);
app.use("/partners/:id/comments", commentRoutes);


app.listen(port, function(){
   console.log("Server Has Started!");
});