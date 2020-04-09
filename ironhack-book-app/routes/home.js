const express     = require('express');
const router      = express.Router();
const passport    = require('passport');
const bcrypt      = require('bcrypt');
const User        = require('../models/users');
const checkRoles  = require('../auth/checkroles');
const uploadCloud = require('../config/cloudinary');
const axios       = require('axios')

//GET show the profile page
router.get('/home',checkRoles(['USER','ADMIN']),(req,res,next)=> {
   //use the right layout
    let layout = 'layout';
    if(req.isAuthenticated()) {
      layout = 'layout-login';
    }
    User.find({username: {$ne:req.user.username}})
        .then(users => {
        const books = req.user.favorites.map(id => {
            return axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
            .then(book => book.data.volumeInfo)
        })
        Promise.all(books)
        .then(results => {
            res.render('private/home.hbs',{layout:layout,user:req.user,otherUsers:users,books:results});
        });
    })  
})


//GET show the friend page
router.get('/friend/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
   //use the right layout
   let layout = 'layout';
   if(req.isAuthenticated()) {
     layout = 'layout-login';
   }
   User.findOne({_id:req.params.id})
    .then(friend => {
        res.render('../views/private/friend.hbs',{layout:layout,user:req.user,friend:friend})
    })    
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

//GET the password page
router.get('/password/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    //use the right layout
    let layout = 'layout';
    if(req.isAuthenticated()) {
        layout = 'layout-login';
    }
    res.render('../views/private/password.hbs',{layout:layout,user:req.user})
})
//POST the password info
router.post('/password/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    const {password} = req.body;
    const hashPass = bcrypt.hashSync(password,10);
    // console.log(password);
    User.updateOne({_id:req.params.id},{ $set: {password:hashPass}})
        .then(()=>{
            res.redirect('/home')
        })   
        .catch(e=>console.error(e)); 
})


module.exports = router;

