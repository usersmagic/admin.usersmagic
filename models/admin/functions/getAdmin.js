module.exports = (admin, callback) => {
  if (!admin || !admin._id)
    return callback('document_not_found');

  return callback(null, {
    _id: admin._id.toString(),
    username: admin.username,
    name: admin.name,
    roles: admin.roles,
    is_global: admin.is_global,
    countries: admin.countries
  });
}
