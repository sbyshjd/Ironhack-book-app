const express       = require('express');
const searchRouter  = express.Router();
const axios         = require('axios');
const User          = require('../models/users');
const checkroles    = require('../auth/checkroles')

searchRouter.post('/search-results',(req, res, next) => {
  console.log(req.body.searchinput)
  const searchInput = req.body.searchinput
  const isLogged = req.isAuthenticated()
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
  .then(response => {
    //console.log(response.data.items[0].volumeInfo)
    const books = response.data.items
    books.map(book => book.islogged = isLogged)
    res.render('searchresults', {books})
    })
  .catch(e => console.log(e))
})

searchRouter.get('/search-results',(req, res, next) => {
  res.render('searchresults') 
})

searchRouter.get('/search-results/:id',(req, res, next) => {
const id = req.params.id
 User.update({_id: req.user._id},{$push: {favorites: id}})
  .then(() => res.redirect('/search-results'))
  .catch(e => console.log(e))
})



module.exports = searchRouter;