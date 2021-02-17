module.exports = (req, res) => {
  res.render('auth/login', {
    page: 'auth/login',
    title: res.__('Login'),
    includes: {
      external: {
        css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome'],
        js: ['page', 'serverRequest']
      }
    }
  });
};
