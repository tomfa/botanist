// Description:
//   Cronjob example.
//   Every 15 minute, will say 'cron job example' in channel #general.
//   Remember that the bot has to be invited to this channel if
//   it's not there already
//

const cron = require('cron');

module.exports = function (robot) {
  const pattern = '0 */15 * * * *';
  const timezone = 'Europe/Oslo';
  const runFn = () => {
    robot.messageRoom('general', 'cron job example');
  };

  new cron.CronJob({
    cronTime: pattern,
    onTick: runFn,
    start: true,
    timeZone: timezone
  });
};
