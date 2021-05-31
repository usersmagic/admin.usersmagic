
module.exports = (req, res) => {
    res.render('case_studies/index', {
        page: 'case_studies/index',
        title: res.__('Case Studies'),
        includes: {
          external: {
            css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
          }
        },
    })
}