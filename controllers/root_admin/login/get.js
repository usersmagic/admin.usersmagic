module.exports = (req, res) => {
  res.render('root_admin/login', {
    page: 'root_admin/login',
    title: res.__('Root Admin Login'),
    includes: {
      external: {
        css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome'],
        js: ['page', 'serverRequest']
      }
    }
  });
};
