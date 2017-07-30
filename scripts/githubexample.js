// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot fancyhello - shows example of a fancy message formatting

var request = require('request');

module.exports = function (robot) {

  // 1: Register listen to repo
  // 2: De-register listen to repo
  // 3. Get pull-request status
  // curl -i -H 'Authorization: token your-token' \
  // https://api.github.com

  const getPullRequests = (token, callback) => {
    var options = {
      url: 'https://api.github.com/repos/otovo/cloud/pulls',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'PyGithub/Python'
      }
    };
    request(options, callback);
  };

  let returnvalue = null;

	robot.respond(/github pulls/, function(res){
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      res.send({
        "attachments": [
          {
            "fallback": "GITHUB_TOKEN var not set",
            "color": "danger",
            "title": "Missing Github token",
            "text": "Token not set. Set with heroku config:set GITHUB=your-github-token. The token can be found at https://github.com/settings/tokens",
          }
        ]
      });
    }
    else {
      const callback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
          const attachments = data.map(d => ({
            "title": d.title,
            "title_link": d.url,
            "fields": [
              {
                "title": "Created at",
                "value": d.created_at,
                "short": true
              }
            ]
          }));
          if (attachments.length()) {
            res.send({
              "attachments": attachments
            });
          } else {
            res.reply('No unmerged Pull requests :)');
          }
        }
      };
      getPullRequests(token, callback)
    }
	})
};
