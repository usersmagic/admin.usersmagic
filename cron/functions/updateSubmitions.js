// Finds and updates all the submitions that are passed dur

const Submition = require('../../models/submition/Submition');

module.exports = () => {
  Submition.terminatePassedDueSubmitions(err => {
    if (err) console.log('Update Passed Due Submitions Error: ' + err);
  });
}
