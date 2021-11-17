require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const cors = require("cors")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("./models/User")

const indexRouter = require('./routes/index');
// const { access } = require('fs');

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.use( 
    new GoogleStrategy(
    {
      clientID: "87981738871-ico9hd17vltrlt4o39a4d4bj63gagt3t.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/login/googleok",
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log("success", accessToken, profile)
        return cb(null, profile)
    })
)

app.use('/', indexRouter);
app.use('/loginWithGoogle', passport.authenticate("google", {scope: "profile"}))
app.use('/login/googleok', passport.authenticate("google", {failureRedirect: "/notFound"}), 
async (req, res, next) =>{
    console.log("input", req.user)
    const userInfo = req.user
    let result = {}
    try {
        const found = await User.findOne({email: userInfo.emails[0].value})
        if(found) throw new Error("User already registered")
        const newUser = {
            name: userInfo.displayName,
            avatar: userInfo.photo[0].value, 
            email: userInfo.emails[0].value,
            password: "abc", 
        }
        result = await User.create(newUser)
    } catch (error) {
        return res.send("error", error)
    }
    return res.send("success", result)
})

app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user)
    })
})
//Catch 404 and throw error
app.use((req, res, next) => {
    const error = new Error ("Url not found")
    error.status=404
    next(error)
})

//Handling all errors
app.use((err, req, res, next) => {
    error.status = error.status ? error.status : 500
    console.log("error handler", err)
    res.status(err.status).send(err.message)
})


module.exports = app;
