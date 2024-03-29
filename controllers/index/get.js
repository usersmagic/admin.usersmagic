// Get / page

module.exports = (req, res) => {
  const menus = [
    {
      name: res.__('Waitlist'),
      details: res.__('See users in the waitlist and take them out of the waitlist'),
      role: 'product_head',
      link: '/waitlist'
    },
    {
      name: res.__('Questions'),
      details: res.__('See, create and edit questions'),
      role: 'product_head',
      link: '/questions'
    },
    {
      name: res.__('Campaigns'),
      details: res.__('See, create, edit and check submitions of campaigns'),
      role: 'product_head',
      link: '/campaigns'
    },
    {
      name: res.__('Payments'),
      details: res.__('See and approve payments of users'),
      role: 'financial_manager',
      link: '/payments'
    },
    {
      name: res.__('Countries'),
      details: res.__('Create and edit countries'),
      role: 'regional_manager',
      link: '/countries'
    },
    {
      name: res.__('Targets'),
      details: res.__('See and approve filter groups of Company\'s'),
      role: 'sales_team',
      link: '/targets'
    },
    {
      name: res.__('Submitions'),
      details: res.__('See submitions to projects made by companies'),
      role: 'sales_team',
      link: '/submitions'
    },
    {
      name: res.__('Companies'),
      details: res.__('See and edit company accounts'),
      role: 'organisation_manager',
      link: '/companies'
    },
    {
      name: res.__('Templates'),
      details: res.__('See, create and edit templates'),
      role: 'product_head',
      link: '/templates'
    },
    {
      name: res.__("Case Studies"),
      details: res.__("Create and edit case studies"),
      role: "product_head",
      link: "/case_studies"
    },
    {
      name: res.__("Comparisons"),
      details: res.__("See, create and download detailed comparison graphs"),
      role: "product_head",
      link: "/comparisons"
    },
    // {
    //   name: res.__('Users'),
    //   details: res.__('See and edit user accounts'),
    //   role: 'organisation_manager',
    //   link: '/users'
    // }
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
