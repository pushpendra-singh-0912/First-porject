if(process.env.NODE_ENV != "production"){
    require('dotenv').config();

}

// console.log(process.env.SECRET) // remove this after 

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const { options } = require("joi");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

const dburl = process.env.ATLASDB_URL;



main().then(()=>{
    console.log("connection is done with database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);

}
const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    }, 
    touchAfter:24*3600,
});
store.on("error",()=>{
     console.log("ERROR in MONGO SESSION STORE",err)
})
// session options
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


// app.get("/",(req,res)=>{
//     res.send("Hii I am root.");
// });



app.use(session(sessionOption));
app.use(flash());

//password authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{                  // middleware for flash message
    res.locals.success=req.flash("success"); 
    res.locals.error=req.flash("error");
    res.locals.currUser =req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"push@gmail.com",
//         username:"pushpp0912"
//     });

//     let registerdUser = await User.register(fakeUser,"pushpendrasingh");
//     res.send(registerdUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.render("error.ejs",{message})
    // res.status(statusCode).send(message)
});

app.listen(port,()=>{
    console.log(`server is working on port ${port}`);
});
