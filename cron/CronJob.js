// CronJob class for scheduling functions
const cron = require('node-cron');

const updateSubmitions = require('./functions/updateSubmitions');
const updateTargets = require('./functions/updateTargets');

const CronJob = {
  start: callback => {
    updateTargets();
    updateSubmitions();

    const job = cron.schedule('* * * * *', () => { // Repeat cron jobs every minute
      updateTargets();
      updateSubmitions();
    });

    setTimeout(() => {
      job.start();
      callback();
    }, 1000); // Start cron jobs 1 second after the function called
  }
}

module.exports = CronJob;
