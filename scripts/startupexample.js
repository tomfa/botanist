// Description:
//   Demonstration of boot up script
//


module.exports = robot => {
  let room = process.env.HOME_CHANNEL;
  if (!room) {
    room = '#dev-bots';
  }
  const startupMessages = ['Good day, sir!', 'Someone rebooted me! How rude!', 'Oh.. where am I?', 'Work work'];
  robot.messageRoom(room, {
    "attachments": [
      {
        "fallback": "Hubot deployed",
        "color": "#36a64f",
        "title": startupMessages[Math.floor((Math.random()*startupMessages.length))],
        "footer": "I was deployed without crashing"
      }
    ]
  });
};
