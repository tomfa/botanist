// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot fancyhello - shows example of a fancy message formatting

const moment = require('moment');
const fetch = require('node-fetch');

const color = date => {
  const DAY = 1000 * 60 * 60 * 24;
  const diff = date - Date.now();
  if (diff < DAY) {
    return 'success';
  }
  if (diff < 2 * DAY) {
    return 'warning';
  }
  return 'danger';
};

const getPullRequests = (token, repo) => (
  fetch(
    `https://api.github.com/repos/${repo}/pulls`,
    { headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'PyGithub/Python'
    }}
  ).then(response => {
      return response
        .json()
        .then(json => ({json, status: response.status}))
        .catch(() => ({json: null, status: response.status}));
    })
);

const sendMissingToken = res => {
  res.send({
    "attachments": [
      {
        "fallback": "GITHUB_TOKEN var not set",
        "color": "danger",
        "title": "Missing Github token",
        "text": "Token not set. Set with heroku config:set GITHUB_TOKEN=your-github-token. The token can be found at https://github.com/settings/tokens",
      }
    ]
  });
};

const handlePullRequestResponse = res => ({ json, status }) => {
  if (status == 200) {
    const attachments = json.map(d => ({
      "title": d.title,
      "title_link": d.url,
      "color": color(d.updated_at),
      "fields": [
        //{
        //  "title": "Created at",
        //  "value": moment(d.created_at).fromNow(),
        //  "short": true,
        //},
        {
          "title": "Updated at",
          "value": moment(d.updated_at).fromNow(),
          "short": true,
        },
        //{
        //  "title": "By",
        //  "value": d.user.login,
        //  "short": true,
        //},
        {
          "title": "Assignee",
          "value": d.assignee && d.assignee.login || 'None',
          "short": true,
        }
      ]
    }));
    if (!attachments.length) {
      return res.send({
        attachments: {
          "title": "No unmerged PRs!",
          "color": "success"
        }
      });
    }
    res.send(`Looks like you've got some work to do`)
    res.send({
      "attachments": attachments
    });
  }
};

module.exports = function (robot) {

  // 1: Register listen to repo
  // 2: De-register listen to repo
  // 3. Get pull-request status
  // curl -i -H 'Authorization: token your-token' \
  // https://api.github.com

	robot.respond(/github pulls/, function(res){
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return sendMissingToken(res);
    }
    getPullRequests(token, "otovo/cloud").then(handlePullRequestResponse(res));
	})
};
