// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot fancyhello - shows example of a fancy message formatting


module.exports = function (robot) {

  // 1: Register listen to repo
  // 2: De-register listen to repo
  // 3. Get pull-request status
  // curl -i -H 'Authorization: token your-token' \
  // https://api.github.com/repos/otovo/cloud/pulls

	robot.respond(/github/, function(res){
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
	})
};
