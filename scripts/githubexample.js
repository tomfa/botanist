// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot github pulls - shows unmerged PRs

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

const handlePullRequestResponse = (res, repo) => ({ json, status }) => {
  if (status == 200) {
    const attachments = json.map(d => ({
      "title": d.title,
      "title_link": d.url,
      "color": color(d.updated_at),
      "fields": [
        {
          "title": "Updated at",
          "value": moment(d.updated_at).fromNow(),
          "short": true,
        },
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
          "title": `No unmerged PRs for ${repo}!`,
          "color": "success"
        }
      });
    }
    res.send(`PRs for ${repo}:`);
    res.send({
      "attachments": attachments
    });
  }
};

module.exports = function (robot) {
	robot.respond(/github pulls/, function(res){
    const token = robot.getVariable('GITHUB_TOKEN');
    if (!token) {
        return robot.complainAboutMissingVariable(res, 'GITHUB_TOKEN', 'your-github-token', 'The token can be found at https://github.com/settings/tokens');
    }
    const repos = robot.getVariable('GITHUB_REPOS');
    if (!repos) {
      return robot.complainAboutMissingVariable(res, 'GITHUB_REPOS', 'tomfa/botanist; tomfa/terraform-sandbox');
    }
    const reposArray = repos.split(';');
    reposArray.forEach(repo => {
      repo = repo.trim();
      getPullRequests(token, repo).then(handlePullRequestResponse(res, repo));
    });
	})
};
