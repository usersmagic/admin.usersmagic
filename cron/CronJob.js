// CronJob class for scheduling functions
const cron = require('node-cron');

const updateTargets = require('./functions/updateTargets');

const CronJob = {
  start: callback => {
    updateTargets();
    const job = cron.schedule('* * * * *', () => { // Repeat cron jobs every minute
      updateTargets();
    });

    setTimeout(() => {
      job.start();
      callback();
    }, 1000); // Start cron jobs 1 second after the function called
  }
}

module.exports = CronJob;
