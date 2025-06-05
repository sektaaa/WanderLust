if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
let app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { valid } = require("joi");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));



// const  mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));

const store = MongoStore.create ({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    },
};




app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

console.log("Connecting to MongoDB with URL:", dbUrl);

async function main() {
    await mongoose.connect(dbUrl);
};


main().then (() =>{
    console.log("connected to db ");
}).catch ((err) =>{
    console.log(err);
});


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


// app.get("/", (req, res) =>{
//     res.send("this is root route");
// });

    

// app.get("/fake", async (req, res) =>{
//     try{
//     let pleaase = new User ({
//         email: "krishna@outlook.in",
//         username: "krishanakanhaiya@111"
//     });

//     let oldUser = await User.register( pleaase, "awwisitreal");
//     res.send(oldUser);
// }
//     catch (err) {
//         console.error("Registration Error:", err);
//     }
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.all ("*", ( req, res, next)  =>{
    next(new ExpressError(404, "Page not Found!"));
} );

app.use ((err, req, res, next) =>{
    let {statusCode= 500, message= "Something wwent wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


app.listen(8080, () =>{
    console.log("app is listening to port 8080");
});

