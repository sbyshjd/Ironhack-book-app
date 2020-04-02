const passport      = require('passport');
const bcrypt        = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/users');

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

module.exports = passport