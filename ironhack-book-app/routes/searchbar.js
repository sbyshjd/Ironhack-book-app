const express       = require('express');
const searchRouter  = express.Router();
const axios         = require('axios');
const User          = require('../models/users');
const checkroles    = require('../auth/checkroles')

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
    // books.map(book => book.islogged = isLogged)
    res.render('searchresults', {books:books,layout:layout,user:user})
    })
  .catch(e => console.log(e))
})

searchRouter.get('/search-results/:id',(req, res, next) => {
  let layout = 'layout';
  let user = null;
  if(req.isAuthenticated()) {
    layout = 'layout-login';
    user = JSON.parse(JSON.stringify(req.user))
  }
  const id = req.params.id
  axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
    .then(result => {
      const book = result.data;
      res.render('../views/book.hbs',{layout:layout,user:user,book:book})
    })

//  User.update({_id: req.user._id},{$push: {favorites: id}})
//   .then(() => res.redirect('/search-results'))
//   .catch(e => console.log(e))
})



module.exports = searchRouter;