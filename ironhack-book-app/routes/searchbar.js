const express       = require('express');
const searchRouter  = express.Router();
const axios         = require('axios');
const User          = require('../models/users');
const Review        = require('../models/review');
const checkRoles    = require('../auth/checkroles');

//GET all the search-results to show on the searchresults.hbs page
searchRouter.post('/search-results',(req, res, next) => {
  let layout = 'layout';
  let user = null;
  if(req.isAuthenticated()) {
    layout = 'layout-login';
    user = JSON.parse(JSON.stringify(req.user))
  }
  const searchInput = req.body.searchinput
  const isLogged = req.isAuthenticated()
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
  .then(response => {
    console.log(response.data.items[0])
    const books = response.data.items;
    res.render('searchresults', {books:books,layout:layout,user:user})
    })
  .catch(e => console.log(e))
})
//GET show the book page for each search-result
searchRouter.get('/search-results/:id',(req, res, next) => {
  let layout = 'layout';
  let user = null;
  if(req.isAuthenticated()) {
    layout = 'layout-login';
    user = JSON.parse(JSON.stringify(req.user))
  }
  const id = req.params.id
  const book = axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
                    .then(result => result.data)
  //get all the comments from database about this book;
  const comments = Review.find({bookID:req.params.id})
                    .populate('creator')

  Promise.all([book,comments])
    .then(results => {
      let book = results[0];
      console.log(book);
      let comments = JSON.parse(JSON.stringify(results[1]));
      // console.log(comments);
      let isAdded = false
      if(user) {
        //to check if the book is already in the users favorites list
        if(user.favorites.includes(book.id)) {
          isAdded = true;
        }
      }
      if (user) {
        comments.forEach(c=>{
          if(c.creator._id === user._id) {
            c.isUser = true;
          } else {
            c.isUser = false;
          }
        })
      }

      res.render('../views/book.hbs',{layout:layout,user:user,book:book,isAdded:isAdded,comments:comments})
    })
})

//GET delete my comment and return to the search-results router 
searchRouter.get('/search-results/comments/delete/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
  const bookID = Review.findOne({_id:req.params.id})
                      .then(review => review.bookID)
  const deleteReview = Review.deleteOne({_id:req.params.id});
  Promise.all([bookID,deleteReview])
    .then(results => {
      const bookID = results[0];
      res.redirect(`/search-results/${bookID}`)
    })
    .catch(e=>console.error(e));

})
//GET add the book to user's favorites and redirect to the same page
searchRouter.get('/book/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
  User.updateOne({_id:req.user._id},{$push:{favorites:req.params.id}})
    .then(()=> res.redirect(`/search-results/${req.params.id}`))
    .catch(e=>console.error(e));
})   

//POST create the comment for the book
searchRouter.post('/comment/:id',checkRoles(['USER','ADMIN']),(req,res,next)=> {
  const {content} = req.body;
  if(!content) {
    res.redirect(`/search-results/${req.params.id}`)
  }
  const creator = req.user._id;
  const bookID = req.params.id;
  axios.get(`https://www.googleapis.com/books/v1/volumes/${bookID}?&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
      .then(result => { 
        const bookTitle = result.data.volumeInfo.title
         Review.create({content:content,creator:creator,bookID:bookID,bookTitle:bookTitle})
          .then(review => {
            User.updateOne({_id:req.user._id},{$push: {reviews:review._id}})
            .then(() => {
              res.redirect(`/search-results/${req.params.id}`);
            })
          })
          .catch(e=>console.error(e))
        })
  
})




module.exports = searchRouter;