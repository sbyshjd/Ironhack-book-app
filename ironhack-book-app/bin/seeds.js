const mongoose = require('mongoose');
const User = require('../models/users')
const bcrypt = require('bcrypt');
const hashPassword = bcrypt.hashSync('password',10);

const admins = [
    {
        username:'michiel',
        password:hashPassword,
        role: 'ADMIN'
    },{
        username:'Boyuan',
        password:hashPassword,
        role: 'ADMIN'
    }
]

mongoose
  .connect('mongodb+srv://boyuan:123456qwer@ironhack-book-app-2cofe.mongodb.net/book-app?retryWrites=true&w=majority', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  User.create(admins)
.then(response => {
  console.log(response)
  mongoose.disconnect()
})
.catch(e => console.log(e))
