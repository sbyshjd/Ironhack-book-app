const express = require('express');
const router  = express.Router();
const password = require('passport')

//GET sign-up route
router.get('/sign-up',(req,res,next)=> {
    res.render('../views/auth/sign-up.hbs');
})
//POST sign-up route to create user
router.post('/sign-up',(req,res,next)=> {

})

//GET sign-in route
router.get('/sign-in',(req,res,next)=> {

})
//use passport to check the sign in and role.
