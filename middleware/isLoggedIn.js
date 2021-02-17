// Check if there is an account information on session, redirect to /auth/login if the request is not logged in

const Admin = require('../models/admin/Admin');

module.exports = (req, res, next) => {
  if (req.session && req.session.admin) { // If logged in
    Admin.getAdminById(req.session.admin._id, (err, admin) => {
      if (err || !admin) return res.status(401).redirect('/auth/login');;
      
      req.session.admin = admin; // Update session
      return next();
    });
  } else {
    if (req.file && req.file.filename) { // If already a file is uploaded on the server
      fs.unlink('./public/res/uploads/' + req.file.file_name, () => {	 // Delete the file, as it is not authenticated
        req.session.redirect = req.originalUrl; // Save redirection url
        return res.status(401).redirect('/auth/login');
      });
    } else {
      req.session.redirect = req.originalUrl; // Save redirection url
      return res.status(401).redirect('/auth/login');
    }
  };
};
