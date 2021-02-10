// Check if there is root_admin field in session to see if admin login is complete or not

module.exports = (req, res, next) => {
  if (req.session && req.session.root_admin) {
    if (process.env.ROOT_ADMIN_PASSWORD == req.session.root_admin)
      return next()

    return res.redirect('/root_admin/login');
  } else {
    return res.redirect('/root_admin/login');
  };
};
