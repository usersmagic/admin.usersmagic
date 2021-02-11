module.exports = (req, res) => {
  res.render('root_admin/index', {
    page: 'root_admin/index',
    title: res.__('Root Admin'),
    includes: {
      external: {
        css: ['page', 'general', 'menu', 'inputs', 'buttons', 'fontawesome'],
        js: ['page']
      }
    },
    menus: [
      {
        name: res.__('Admin Users'),
        details: res.__('Create and organize admin users'),
        role: res.__('Root Admin'),
        link: '/root_admin/admins'
      },
      {
        name: res.__('Countries'),
        details: res.__('Create and edit countries'),
        role: res.__('Root Admin'),
        link: '/root_admin/countries'
      }
    ]
  });
};
