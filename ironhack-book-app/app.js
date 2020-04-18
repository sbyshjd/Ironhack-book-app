require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
// const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const passport     = require('./auth/passport');
const exphbs       = require('express-handlebars');
 

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });
// const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        

// const url = "mongodb+srv://boyuan:123456qwer@ironhack-book-app-2cofe.mongodb.net/book-app?retryWrites=true&w=majority";

// const client = new MongoClient(url);

// async function run() {
//     try {
//         await client.connect();
//         console.log("Connected correctly to server");

//     } catch (err) {
//         console.log(err.stack);
//     }
//     finally {
//         await client.close();
//     }
// }

// run().catch(console.dir);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

const hbs = exphbs.create({
  extname      :'hbs',
  layoutsDir   : './views/layouts/',
  defaultLayout: 'layout',
  // helpers      : 'path/to/helpers/directory',
  partialsDir  : [
      './views/partials/'
  ]
});
// Middleware Setup

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// set up the session middleware for passport log-in
app.use(
    session({
      secret: 'our-passport-local-strategy-app',
      resave: true,
      saveUninitialized: true
    })
  );
// Middleware passport setup. required from './auth/passport'
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Ironhack-Book-App';



const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/',auth);
const searchBar = require('./routes/searchbar')
app.use('/', searchBar)
// const user = require('./routes/user')
// app.use('/user', user)
const home = require('./routes/home');
app.use('/',home);
const admin = require('./routes/admin');
app.use('/',admin);


module.exports = app;
