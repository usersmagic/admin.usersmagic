// Finds and updates all the targets with the status: approved and submition_limit > 0

const Target = require('../../models/target/Target');

module.exports = () => {
  Target.updateTargetsUsersList(err => {
    if (err) console.log(err);
  });
}
