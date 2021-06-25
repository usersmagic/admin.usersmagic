// Edit the company with the given id on query and data on req.body
// XMLHTTP Request

const Company = require('../../../models/company/Company');

module.exports = (req,res) =>{
  Company.updateCompany(req.query.id, req.body, err =>{
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }
    
    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
