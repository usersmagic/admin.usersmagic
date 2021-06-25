// Get /users page with the filters and options on the query

const User = require('../../../models/user/User');

module.exports = (req, res) =>{
  User.getUsersByFiltersAndOptions(req.query, req.query, (err, data) =>{
    if (err) return res.redirect('/');

    return res.render('users/index', {
      page: 'users/index',
      title: res.__('Users'),
      includes:{
        external:{
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
        }
      },
      admin: req.session.admin,
      users: data.users,
      filters: data.filters,
      options: data.options
    });
  });
}
