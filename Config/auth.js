module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  req.flash('error_msg', 'Please Login to view this Page');
  res.redirect('/users/login');
};
