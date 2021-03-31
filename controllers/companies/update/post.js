const Company = require('../../../models/company/Company');

module.exports = (req,res) =>{
  const company_id = req.body.company_id;

    Company.updateCompany(company_id, req.body, err =>{
      if(err){
        res.write(JSON.stringify({success:false, error:err}))
        return res.end();
      }

      res.write(JSON.stringify({success: true}))
      return res.end();
    })
}
