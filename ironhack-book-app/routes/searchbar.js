const express       = require('express');
const searchRouter  = express.Router();
const axios         = require("axios");

searchRouter.get('/search-results',(req, res, next) => {
  res.render('searchresults')
})

searchRouter.post('/search-results',(req, res, next) => {
  console.log(req.body.searchinput)
  const searchInput = req.body.searchinput
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
  .then(response => {
    console.log(response.data.items[0].volumeInfo)
    const books = response.data.items
    res.render('searchresults', {books})
    })
  .catch(error => console.log(error))
})


module.exports = searchRouter;