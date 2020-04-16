const checkRoles = role => {
    return (req, res, next) => {
      if(req.isAuthenticated() && role.includes(req.user.role)) {
        next();
      } else {
        res.redirect('/log-in');
      }
    }
  }
  
  module.exports = checkRoles;