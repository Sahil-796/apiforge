const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs')
const User = require('../models/User')
require('dotenv').config();

passport.use(new LocalStrategy( {usernameField:'email'},

    async (email, password, done) => {
        try {
            const user = await User.findOne({email, googleId: null})
            if (!user) return done(null, false, {message: 'User not found'})

            const isMatch = await bcrypt.compare(password, user.password)
            
            if(!isMatch) return done(null, false, {message: 'Incorrect password'})

            return done(null, user)
        } catch(err) {
            return done(err)
        }
    }
))



passport.use(new GoogleStrategy ({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try{
        const existingUser = await User.findOne({email: profile.emails[0].value})

        if(existingUser) return done(null, existingUser)
        
        const newUser = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: 'google',
        })

        return done(null, newUser)
    } catch (err) { 
         
        return done(err)}
}))


//serialiser and desrialise are from passport.js 
//they take user.id from either local or google strategy
//serialiser - called once after login, stores id to session cookie
//desrialiser runs on every request after login, takes id, fetches full user from mongodb
//req.user comes from here, desrialiser - the chad 🗿

passport.serializeUser((user, done) => {
    done(null, user.id)
}) 
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err)
    }
})