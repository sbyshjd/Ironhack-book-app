const express = require('express');
const router  = express.Router();
const passport = require('passport');
const bcrypt   = require('bcrypt');
const User     = require('../models/users');
const checkRoles = require('../auth/checkroles');
const uploadCloud = require('../config/cloudinary');

//GET show the profile page
router.get('/home',checkRoles(['USER','ADMIN']),(req,res,next)=> {
   //use the right layout
    let layout = 'layout';
    if(req.isAuthenticated()) {
      layout = 'layout-login';
    }
    res.render('../views/private/home.hbs',{layout:layout,user:req.user})
})
//GET the profile edit page
router.get('/home/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    //use the right layout
    let layout = 'layout';
    if(req.isAuthenticated()) {
        layout = 'layout-login';
    }
    User.findOne({_id:req.params.id})
        .then(user => {
            res.render('../views/private/home-edit.hbs',{layout:layout,user:user})
        })
})
//POST the profile info back to database
router.post('/home/edit/:id',checkRoles(['USER','ADMIN']),uploadCloud.single('photo'),(req,res,next)=> {
    const userName = req.body.username;
    const profileImage = req.file.url;
    User.updateOne({_id:req.params.id},{ $set: {username:userName,profileImage:profileImage}})
        .then(()=> {
            res.redirect('/home')
        })
})
module.exports = router;

