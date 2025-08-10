module.exports = (req, res, next) => {
  res.locals.signedInUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};