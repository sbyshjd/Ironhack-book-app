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
        .catch(e=>console.error(e));
})

//GET sign-in route
router.get('/log-in',(req,res,next)=> {
    res.render('../views/auth/log-in.hbs');
})
//use passport to check the sign in and role.




module.exports = router;