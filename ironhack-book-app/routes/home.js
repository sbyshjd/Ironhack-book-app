const express     = require('express');
const router      = express.Router();
const passport    = require('passport');
const bcrypt      = require('bcrypt');
const User        = require('../models/users');
const Review      = require('../models/review');
const checkRoles  = require('../auth/checkroles');
const uploadCloud = require('../config/cloudinary');
const axios       = require('axios')

//GET show the profile page
router.get('/home',checkRoles(['USER','ADMIN']),(req,res,next)=> {
   //use the right layout
    let user = null;
    let layout = 'layout';
    if(req.isAuthenticated()) {
      layout = 'layout-login';
      user = JSON.parse(JSON.stringify(req.user))
    }
    const friends = User.findOne({_id:req.user._id})
                    .populate('friends')
                    .then(user => user.friends)

    const otherUsers = User.find({_id:{$ne:req.user._id}})
    
    const books = req.user.favorites.map(id => {
         return axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
        .then(book => book.data)
        .catch(e=>console.log(e));
    }) 
    const comments = Review.find({creator:user._id})
    Promise.all([friends, comments, otherUsers, ...books])
        .then(results => {
            const friends = JSON.parse(JSON.stringify(results[0]));
            const comments = JSON.parse(JSON.stringify(results[1]));
            const others = JSON.parse(JSON.stringify(results[2]));
            results.splice(0,3);
            res.render('private/home.hbs',{layout:layout, user:user, friends:friends, otherUsers:others, comments:comments, books:results}); // otherUsers:others
        });
    
})
//GET delete one book from my favorites
router.get('/favorites/delete/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    const bookID = req.params.id;
    User.updateOne({_id:req.user._id},{$pull:{favorites:bookID}})
        .then(res.redirect('/home'))
        .catch(e => console.error(e));
})
 
router.get('/comments/delete/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    Review.deleteOne({_id:req.params.id})
        .then(res.redirect('/home'))
        .catch(e=>console.error(e));
})


//POST search user and show profile page of user.
router.post('/profile', checkRoles(['USER','ADMIN']), (req, res, next) => {
    let user = null;
    let layout = 'layout';
    if(req.isAuthenticated()) {
     layout = 'layout-login';
     user = JSON.parse(JSON.stringify(req.user))
    }
    User.find({username: req.body.username})
    .then(user => {
        const profile = JSON.parse(JSON.stringify(user[0]))
        res.render('private/profile', {user:user, layout:layout, profile:profile})
    })
    .catch(e => console.log(e))
})

//GET add friend to user
router.get('/add/:id', checkRoles(['USER','ADMIN']), (req, res, next) => {
    User.updateOne({_id:req.user._id},{$push:{friends:req.params.id}})
    .then(() => res.redirect('/home'))
    .catch(e => console.log(e))
})

//GET delete friend from user page
router.get('/delete/:id', checkRoles(['USER','ADMIN']), (req, res, next) => {
    User.updateOne({_id:req.user._id},{$pull:{friends:req.params.id}})
    .then(() => res.redirect('/home'))
    .catch(e => console.log(e))
})


//GET show the profile page
router.get('/profile/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
   //use the right layout
   let user = null;
   let layout = 'layout';
   let isFriend = false;
   if(req.isAuthenticated()) {
     layout = 'layout-login';
     user = JSON.parse(JSON.stringify(req.user))
   }
   User.findOne({_id:req.params.id})
    .populate('reviews')
    .then(result => {
        const friend = JSON.parse(JSON.stringify(result));
        const comments = JSON.parse(JSON.stringify(result.reviews));
        console.log(comments);
        if (req.user.friends.includes(result._id)) {
            isFriend = true;
        }
        res.render('private/profile',{layout:layout, user:user, profile:friend, isFriend:isFriend, comments:comments})
    })
    .catch(e => console.log(e))    
})


//GET the profile edit page
router.get('/home/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    //use the right layout
    let user = null;
    let layout = 'layout';
    if(req.isAuthenticated()) {
        layout = 'layout-login';
        user = JSON.parse(JSON.stringify(req.user))
    }
    
    User.findOne({_id:req.params.id})
        .then(user => {
            res.render('private/home-edit.hbs', {layout:layout,user:user})
        })
})
//POST the profile info back to database
router.post('/home/edit/:id',checkRoles(['USER','ADMIN']),uploadCloud.single('photo'),(req,res,next)=> {
    const userName = req.body.username;
    const profileImage = req.file.url;  
    User.updateOne({_id:req.params.id},{$set: {username:userName,profileImage:profileImage}})
        .then(()=> {
            res.redirect('/home')
        })
})

//GET the password page
router.get('/password/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
    //use the right layout
    let user = null;
    let layout = 'layout';
    if(req.isAuthenticated()) {
        layout = 'layout-login';
        user = JSON.parse(JSON.stringify(req.user))
    }
    res.render('../views/private/password.hbs',{layout:layout,user:user})
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

