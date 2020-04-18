const express    = require('express');
const router     = express.Router();
const checkRoles = require('../auth/checkroles');
const User       = require('../models/users');
const Review     = require('../models/review');
const axios      = require('axios')
const uploadCloud = require('../config/cloudinary');

//GET the admin main page
router.get('/admin',checkRoles(['ADMIN']),(req,res,next)=> {
    let user = null;
    let layout = 'layout';
    let isADMIN = false;
    if(req.isAuthenticated()) {
      layout = 'layout-login';
      user = JSON.parse(JSON.stringify(req.user));
      if(req.user.role === 'ADMIN') {
        isADMIN = true;
      }
    }
    const thisUser = User.findOne({_id:req.user._id});
    const allUsers = User.find();
    Promise.all([thisUser,allUsers])
        .then(result => {
            const user = JSON.parse(JSON.stringify(result[0]));
            const allTheUsers = JSON.parse(JSON.stringify(result[1]));
            res.render('admin/admin.hbs',{user:user,allTheUsers:allTheUsers,isADMIN,layout:layout})
        })
    
})

//GET got the admin-user page to edit the user's profile
router.get('/user/:id',checkRoles(['ADMIN']),(req,res,next)=> {
    let user = null;
    let layout = 'layout';
    let isADMIN = false;
    if(req.isAuthenticated()) {
      layout = 'layout-login';
      user = JSON.parse(JSON.stringify(req.user));
      if(req.user.role === 'ADMIN') {
        isADMIN = true;
      }
    }
    const id = req.params.id;
   
   User.findOne({_id:id})
            .populate('reviews')
            .populate('friends')
                .then(u => {
                    const thisUser = JSON.parse(JSON.stringify(u));
            const books = thisUser.favorites.map(id => {
            return axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
                            .then(book => book.data)
                            .catch(e=>console.log(e));
                        }) 
                    Promise.all(books)
                    .then(result =>{
                        console.log(thisUser);
                        res.render('admin/user.hbs',{user:user,layout:layout,thisUser:thisUser,books:result,isADMIN})
                    })     
                    })
                    .catch(e=>console.error(e));


})
//GET delete one book from the user's model and update the model
router.get('/user/:userID/book/delete/:id',checkRoles(['ADMIN']),(req,res,next)=> {
  const bookID = req.params.id;
  User.updateOne({_id:req.params.userID},{$pull:{favorites:bookID}})
    .then(()=> {
      res.redirect(`/user/${req.params.userID}`)
    })
    .catch(e=>console.error(e));
})
//GET delete one friend from the user's model and update the model
router.get('/user/:userID/delete/friend/:id',checkRoles(['ADMIN']),(req,res,next)=> {
  const friendID = req.params.id
  User.updateOne({_id:req.params.userID},{$pull:{friends:friendID}})
    .then(()=> {
      res.redirect(`/user/${req.params.userID}`)
    })
    .catch(e=>console.error(e));
})
//GET delete one comments from the user's model and update the model
router.get('/user/:userID/delete/friend/:id',checkRoles(['ADMIN']),(req,res,next)=> {
  const commentID = req.params.id
  User.updateOne({_id:req.params.userID},{$pull:{reviews:commentID}})
    .then(()=> {
      Review.deleteOne({_id:commentID})
        .then(() => {
        res.redirect(`/user/${req.params.userID}`)
      })  
    })
    .catch(e=>console.error(e));
})

//GET delete the whole profile of the user;
router.get('/user/delete/:id',checkRoles(['ADMIN']),(req,res,next)=> {
  const userID = req.params.id;
  //find this user
  User.findOne({_id:userID})
  .then(user => {
    //delete all his comments
    Review.deleteMany({_id:{$in:user.reviews}})
    .then(() => {
      //find his friends
      User.updateMany({_id:{$in:user.friends}},{$pull:{friends:userID}})
        .then(() => {
          User.deleteOne({_id:userID})
            .then(()=> {
              res.redirect('/admin')
            })
        })
    })
  })
    .catch(e=>console.error(e));
})

//GET update the user's profile
router.post('/user/update/:id',checkRoles(['ADMIN']),uploadCloud.single('photo'),(req,res,next)=> {
  const userName = req.body.username;
  const profileImage = req.file.url;  
  User.updateOne({_id:req.params.id},{$set: {username:userName,profileImage:profileImage}})
      .then(()=> {
          res.redirect('/admin')
      })
})
module.exports = router;
