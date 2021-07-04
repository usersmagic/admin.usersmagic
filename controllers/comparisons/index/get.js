
module.exports = (req, res) => {
  res.render('comparisons/index', {
    page: 'comparisons/index',
    title: res.__('Comparisons'),
    includes: {
      external: {
        css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
        js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
      }
    },
  })
}