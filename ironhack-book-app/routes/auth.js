const express = require('express');
const router  = express.Router();
const passport = require('passport');
const bcrypt   = require('bcrypt');
const User     = require('../models/users');

//GET sign-up route
router.get('/sign-up',(req,res,next)=> {
    res.render('../views/auth/sign-up.hbs');
})
//POST sign-up route to create user
router.post('/sign-up',(req,res,next)=> {
    const {username,password} = req.body;
    if(!username || !password) {
        res.render('../views/auth/sign-up.hbs',{message:'Indicate the username and password'});
        return;
    }
    User.findOne({username:username})
        .then(user => {
            if(user !==null) {
                res.render('../views/auth/sign-up.hbs',{message:'The username already exists!'});
                return;
            }
            const hash = bcrypt.hashSync(password,10);
            User.create({username:username,password:hash,role:'USER'})
                .then(res.redirect('/'))
        })

        .catch(e=>console.error(e))
})

//GET log-in route
router.get('/log-in',(req,res,next)=> {
    res.render('../views/auth/log-in.hbs');
})
//POST use passport to check the sign in and role.
router.post('/log-in',
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/log-in',
        // failureFlash:true,
        // passReqToCallback:true
    })
);
//GET lon in page for google account.
router.get('/auth/google',
    passport.authenticate('google',{scope:['https://www.googleapis.com/auth/userinfo.profile']})
)
router.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect:'/',
        failureRedirect:'/log-in'
    })
)
//GET log-out page for
router.get('/log-out', (req,res)=> {
    req.logout();
    res.redirect('/');
})



module.exports = router;