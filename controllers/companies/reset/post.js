const Company = require('../../../models/company/Company');

module.exports = (req,res) =>{
  const company_name = req.body.company_name;
  const password = req.body.password;

  Company.resetPassword(company_name, password, err =>{
    if(err){
      res.write(JSON.stringify({success:false, error:err}))
      return res.end();
    }

    res.write(JSON.stringify({success: true}))
    return res.end();
  })
}
