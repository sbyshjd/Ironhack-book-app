const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let isLogged = req.isAuthenticated();
  console.log(req.isAuthenticated());
  res.render('../views/index.hbs',{isLogged:isLogged,user:req.user});
});

module.exports = router;
