// Get / page

module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: 'Main Page',
    includes: {
      external: {
        css: ['page', 'fontawesome', 'general']
      }
    }
  });
}
