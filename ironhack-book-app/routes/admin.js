const express    = require('express');
const router     = express.Router();
const checkRoles = require('../auth/checkroles');
const User       = require('../models/users');
const axios      = require('axios')

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
                        res.render('admin/user.hbs',{user:user,layout:layout,thisUser:thisUser,books:result})
                    })     
                    })
                    .catch(e=>console.error(e));


})
//
module.exports = router;
