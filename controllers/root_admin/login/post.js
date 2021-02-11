module.exports = (req, res) => {
  if (req.body && req.body.password) {
    if (process.env.ROOT_ADMIN_PASSWORD == req.body.password) {
      req.session.root_admin = req.body.password;
      res.write(JSON.stringify({ success: true }));
      return res.end();
    }

    res.write(JSON.stringify({ error: 'password_verification', success: false }));
    return res.end();
  } else {
    res.write(JSON.stringify({ error: 'bad_request', success: false }));
    return res.end();
  }
}
