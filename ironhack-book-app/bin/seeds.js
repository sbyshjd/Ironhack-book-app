const mongoose = require('mongoose');
const User = require('../models/users')

const admins = [
    {
        username:'michiel',
        password:'password1',
        role: 'ADMIN'
    },{
        username:'Boyuan',
        password:'password2',
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
