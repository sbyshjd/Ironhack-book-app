const passport      = require('passport');
const bcrypt        = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/users');
const GoogleStrategy= require('passport-google-oauth20').Strategy;

passport.serializeUser((user,callback)=> {
    callback(null,user._id);
});
passport.deserializeUser((id,callback)=> {
    User.findById(id)
        .then(user => {
            callback(null,user)
        })
        .catch(e=>console.error(e));
});
//use the local strategy of the passport;
passport.use(
    new LocalStrategy((username,password,callback) => {
        User.findOne({username})
            .then(user => {
                if(!user) {
                    return callback(null,false,{message:'Incorrect username'});
                }
                if(!bcrypt.compareSync(password,user.password)) {
                    return callback(null,false,{message:'Incorrect password'});
                }
                callback(null,user);
            })
            .catch(e=>console.error(e));
    })
);
//use the google strategy to login with your google account.
passport.use(new GoogleStrategy({
    clientID:'854111556777-vc3nsbslnd15ar71eo0gvi08n0grutva.apps.googleusercontent.com',
    clientSecret:'Fr9OLly9A21gy5VFv1HJt3QM',
    callbackURL:'/auth/google/callback',
    },
    (accessToken,refreshToken,profile,done)=> {
        console.log('Google account details',profile);
        User.findOne({googleID:profile.id})
            .then(user => {
                if(user) {
                    done(null,user);
                    return;
                }
                User.create({googleID:profile.id,username:profile.displayName})
                    .then(newUser => {
                        done(null,newUser);
                    })
                    .catch(e=>done(e));
            })
            .catch(e=>done(e));
    }
))

module.exports = passport;