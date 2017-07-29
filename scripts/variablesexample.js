// Description:
//   Variable example.
//   Example where robot stores/changes variable over time
//
// Commands:
//   hubot have a soda - will accept, given it hasn't had enough already

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
