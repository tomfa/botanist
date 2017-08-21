// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot sentry status - shows updates on sentry the last 24h

const fetch = require('node-fetch');

const baseUrl = 'https://sentry.io';

const getIssues = (organizationSlug, projectSlug, token) => (
  fetch(
    `${baseUrl}/api/0/projects/${organizationSlug}/${projectSlug}/issues/`,
    { headers: {
      'Authorization': `Bearer ${token}`
    }}
  ).then(response => {
      console.log('url')
      console.log(`${baseUrl}'/api/0/projects/${organizationSlug}/${projectSlug}/issues/`)
      console.log('Authorization')
      console.log(`Bearer ${token}`)
      return response
        .json()
        .then(json => ({json, status: response.status}))
        .catch(() => ({json: null, status: response.status}));
    })
);

const handleIssuesResponse = (res, organization, project) => ({ json, status }) => {
  console.log(status)
  console.log('status')
  if (status == 200) {
    let todayNew = 0;
    let todayTotal = 0;
    let maxErrorIssue = null;
    const issueCount = json.length;
    let issueCountNew = 0;
    const today = new Date();
    const yesterday = new Date(today - 24 * 3600 * 1000);

    json.forEach(d => {
      const isActiveIssue = new Date(d.lastSeen) > yesterday;
      if (!isActiveIssue) { return; }
      const isNewIssue = new Date(d.firstSeen) > yesterday;
      const numEventsLastDay = d.stats['24h'].reduce((sum, value) => sum + value[1], 0);
      d.lastDayIssuesNum = numEventsLastDay;

      if (isNewIssue) {
        issueCountNew += 1;
        todayNew += numEventsLastDay;
      }
      if (!maxErrorIssue || maxErrorIssue.lastDayIssuesNum < numEventsLastDay) {
        maxErrorIssue = d;
      }
      todayTotal += numEventsLastDay;
    });

    return res.send({
      attachments: [
        {
          "title": `${todayTotal} events last 24h for ${project}`,
          "title_link": `https://sentry.io/${organization}/${project}/`,
          "fields": [
            {
              "title": "Total issues",
              "value": issueCount,
              "short": true
            },
            {
              "title": "New issues",
              "value": issueCountNew,
              "short": true
            }
          ]
        },
        {
          "title": `Winner: ${maxErrorIssue.id}`,
          "title_link": maxErrorIssue.permalink,
          "fields": [
            {
              "title": "Total count / last 24h",
              "value": `${maxErrorIssue.count} / ${maxErrorIssue.lastDayIssuesNum}`,
              "short": true
            },
            {
              "title": "Assignee",
              "value": maxErrorIssue.assignedTo,
              "short": true
            }
          ]
        }
      ]
    });
  }
};

module.exports = function (robot) {
	robot.respond(/sentry status/, function(res){
    const token = robot.getVariable('SENTRY_TOKEN');
    if (!token) {
        return robot.complainAboutMissingVariable(res, 'SENTRY_TOKEN', 'your-sentry-token', 'The token can be found at https://sentry.io/api/');
    }
    const organization = robot.getVariable('SENTRY_ORGANIZATION');
    if (!organization) {
      return robot.complainAboutMissingVariable(res, 'SENTRY_ORGANIZATION', 'myCompany');
    }
    const projects = robot.getVariable('SENTRY_PROJECTS');
    if (!projects) {
      return robot.complainAboutMissingVariable(res, 'SENTRY_PROJECTS', 'web;backend');
    }
    const projectArray = projects.split(';');
    projectArray.forEach(project => {
      project = project.trim();
      getIssues(organization, project, token).then(handleIssuesResponse(res, organization, project));
    });
	})
};
