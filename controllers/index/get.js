// Get / page

module.exports = (req, res) => {
  const menus = [
    {
      name: res.__('Waitlist'),
      details: res.__('See users in the waitlist and take them out of the waitlist'),
      role: 'product_head',
      link: '/waitlist'
    },
  ];

  return res.render('index/index', {
    page: 'index/index',
    title: 'Main Page',
    includes: {
      external: {
        css: ['page', 'fontawesome', 'general', 'menu']
      }
    },
    admin: req.session.admin,
    menus: menus
            .filter(menu => req.session.admin.roles.includes(menu.role))
            .map(menu => {
              return {
                name: menu.name,
                details: menu.details,
                role: res.__(menu.role),
                link: menu.link
              };
            })
  });
}
