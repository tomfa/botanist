// Description:
//   Help utils for setting/getting variables
//
// Commands:
//   hubot set variable {variable}={value} - sets variable in brain. Will not override environment variables

const getVariable = robot => variable => {
  const envVariable = process.env[variable];
  if (envVariable) {
    return envVariable;
  }

  const brainVariable = robot.brain.get(variable);
  if (brainVariable) {
    return brainVariable;
  }
};

const complainAboutMissingVariable = (res, variable, example='your-value', help_text) => {
  res.send({
    "attachments": [
      {
        "fallback": `${variable} var not set`,
        "color": "danger",
        "title": `Missing variable ${variable}`,
        "text": `${variable} not set. Set with heroku config:set ${variable}=${example}, or by telling me "set variable ${variable}=${example}". ${help_text}`,
        "footer": 'Note that environment variables will override what you tell me'
      }
    ]
  });
};

module.exports = function (robot) {
  robot.getVariable = getVariable(robot);
  robot.complainAboutMissingVariable = complainAboutMissingVariable;

  robot.respond(/set variable ([a-zA-Z0-9\._]+)=((.)+)/, function(res){
    let variable = res.match[1];
    let value = res.match[2];
    if (process.env[variable]) {
      return res.reply(`${variable} is already set by environment variables`);
    }
    robot.brain.set(variable, value);
    return res.reply(`Setting ${variable}=${value}`);
  })
};
