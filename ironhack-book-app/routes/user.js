const express       = require('express');
const userRouter  = express.Router();
const axios         = require('axios');
const User          = require('../models/users');
const checkroles    = require('../auth/checkroles')
const ensureLogin   = require('connect-ensure-login').ensureLoggedIn;

userRouter.get('/my-books', ensureLogin('/log-in'), (req, res, next) => {
    User.find({favorites: req.user.favorites})
    .then(ids => {
        const bookIds = ids[0].favorites
        return bookIds
    })
    .then(bookIds => {
        bookIds.forEach(id => {
            let books = []
            axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=AIzaSyAMNHv1Hf_DoGzNa4RSTRzDJjM2QEE6uvs`)
            .then(book => {
                books.push(book.data.volumeInfo)
            })
        })
        console.log(books)
        res.render('mybooks', {books})
    })
    .catch(e => console.log(e))
})

module.exports = userRouter;