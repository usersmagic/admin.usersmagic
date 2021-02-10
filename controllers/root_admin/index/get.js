module.exports = (req, res) => {
  res.render('root_admin/index', {
    page: 'root_admin/index',
    title: res.__('Root Admin'),
    includes: {
      external: {
        css: ['page', 'general', 'inputs', 'buttons', 'fontawesome'],
        js: ['page']
      }
    }
  });
};
