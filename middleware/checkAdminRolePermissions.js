// Check if the admin with the given permissions can access this page
// Redirect to /auth/login if there is an error

const menus = [
  {
    role: 'product_head',
    link: '/waitlist'
  },
  {
    role: 'product_head',
    link: '/questions'
  },
  {
    role: 'product_head',
    link: '/campaigns'
  },
  {
    role: 'financial_manager',
    link: '/payments'
  },
  {
    role: 'regional_manager',
    link: '/countries'
  },
  {
    role: 'sales_team',
    link: '/targets'
  },
  {
    role: 'sales_team',
    link: '/submitions'
  },
  {
    role: 'product_head',
    link: '/templates'
  }
];

module.exports = (req, res, next) => {
  const admin = req.session.admin;
  const route = '/' + req.originalUrl.split('/').map(each => each.split('?')[0]).filter(each => each.length)[0];
  const menu = menus.find(menu => menu.link == route);

  if (!menu || !admin.roles.includes(menu.role))
    return res.redirect('/auth/login');

  return next();
}
