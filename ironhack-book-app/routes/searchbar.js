const express       = require('express');
const searchRouter  = express.Router();
const axios         = require('axios');

const checkroles    = require('../auth/checkroles')
let books = null

searchRouter.post('/search-results',(req, res, next) => {
  console.log(req.body.searchinput)
  const searchInput = req.body.searchinput
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
  .then(response => {
    console.log(response.data.items[0].volumeInfo)
    books = response.data.items
    res.redirect('/search-results')
    })
  .catch(error => console.log(error))
})

searchRouter.get('/search-results',(req, res, next) => {
  books.map(book => book.islogged = req.isAuthenticated())
  res.render('searchresults', {books}) 
})





module.exports = searchRouter;