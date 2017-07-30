// Description:
//   Variable example.
//   Example where robot stores/changes variable over time
//
// Commands:
//   hubot have a soda - will accept, given it hasn't had enough already
//
// Note that on Heroku free dynos, redis is non-persistent, which means
// all your  'brain' is reset when a dyno is restarted/deployed to

const cron = require('cron');

module.exports = function (robot) {
  robot.respond(/have a soda/, res => {
    const sodasHad = robot.brain.get('totalSodas');
    if (sodasHad > 4) {
      res.reply('I am too fizzy!');
    } else {
      res.reply('Sure!')
    }

    robot.brain.set('totalSodas', sodasHad + 1);
  });
};
