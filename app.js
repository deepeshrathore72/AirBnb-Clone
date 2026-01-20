if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ATLASDB_URL = process.env.ATLASDB_URL || process.env.MONGODB_URL;
const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
// 860314
// we have used 'MVC' framework here which means : "Model - View - Controller".


main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{console.error(err)});

async function main() {
    await mongoose.connect(ATLASDB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: ATLASDB_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600, //time in seconds after which the session will be updated even if no changes are made
});

store.on("error", () =>{
    console.log("Error in mongo session store", err);
});

const sessionOptions = session({ 
    store,
    secret: process.env.SECRET, 
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*3,//multiply by 1000 to convert miliseconds into seconds
        maxAge : 1000*60*60*24*3,//3 days
        httpOnly : true,
    }
});

app.use(sessionOptions);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //current user is available in all templates through this variable
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser , "password");
//     res.send(registeredUser);
// });

// Homepage route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/testListing", async (req, res)=>{
//     // create a new listing with the data in req.body
//     let sampleListing = new Listing({
//         title:"sampleTitle",
//         description:"This is just a sample description.",
//         price:500,
//         location : "Calangute, goa",
//         country : "india"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next)=>{
    let {status=500, message="Something went wrong!"} = err;
    res.status(status).render("error.ejs", {err});
    // res.status(status).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});