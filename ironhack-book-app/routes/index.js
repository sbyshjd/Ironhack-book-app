const express = require('express');
const router  = express.Router();
const axios   = require('axios');

/* GET index page */
router.get('/', (req, res, next) => {
  //set the layout for visitor or user 
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
      res.render('../views/index.hbs',{layout:layout,user:user,isADMIN})
})



//GET the random page
router.get('/random', (req, res, next) => {
  //set the layout for visitor or user 
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
  //get the random book for recommendation
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomLetter = char.charAt(Math.floor(Math.random()*62));
  
  // console.log(randomLetter);
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${randomLetter}&maxResults=40&key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
    .then(results => {
      const recommendationBooks = results.data.items.filter(b=>{
        if(b.volumeInfo.description) {
          return true;
        }
      }); 
      let randomNum = Math.floor(Math.random()*recommendationBooks.length);
      const randomBook = recommendationBooks[randomNum];
      // console.log(randomBook.volumeInfo);
      res.render('random-book.hbs',{layout:layout,user:user,book:randomBook.volumeInfo,isADMIN})
    })
  ;
});
module.exports = router;
