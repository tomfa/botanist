// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot sentry status - shows updates on sentry the last 24h

const fetch = require('node-fetch');
const cron = require('cron');

const baseUrl = 'https://sentry.io';

async function getIssues(organizationSlug, projectSlug, token) {
  const url = `${baseUrl}/api/0/projects/${organizationSlug}/${projectSlug}/issues/`;
  return await getShit(url, token);
}

async function getShit(url, token) {
   const response = await fetch(
    url,
    { headers: {
      'Authorization': `Bearer ${token}`
    }}
  );

  let json = await response.json();
  const link = response.headers.get('link');
  const results = link.split(';')[5] === ' results="true"';
  const nextURL = link.substring(link.lastIndexOf("<")+1,link.lastIndexOf(">"));

  if (results) {
    const nextShit = await getShit(nextURL, token);
    json = json.concat(nextShit.json);
  }

  return { json, status: response.status };

}

const color = count => {
  if (count < 50) {
    return '#36a64f';
  }
  if (count < 100) {
    return 'warning';
  }
  return 'danger';
};

const handleIssuesResponse = (organization, project, { json, status }) => {
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

    return ({
      attachments: [
        {
          color: color(todayTotal),
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
          color: color(maxErrorIssue.lastDayIssuesNum),
          "title": `Winner: "${maxErrorIssue.title.substr(0,50)}"`,
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
            },
            {
              "title": "Culprit",
              "value": maxErrorIssue.culprit,
              "short": true
            },
            {
              "title": "First seen",
              "value": maxErrorIssue.firstSeen,
              "short": true
            },
          ]
        }
      ]
    });
  }
};

function reportSentryStatus(robot, chatRoom, greeting) {
  const token = robot.getVariable('SENTRY_TOKEN');
  const organization = robot.getVariable('SENTRY_ORGANIZATION');
  const projects = robot.getVariable('SENTRY_PROJECTS');
  if (!token || !organization || !projects) {
    console.log('Missing sentry variables. Cron will not run');
    return;
  }
  const projectArray = projects.split(';');
  if (greeting) {
    robot.messageRoom(chatRoom, greeting);
  }

  projectArray.forEach(project => {
    project = project.trim();
    getIssues(organization, project, token).then(data => {
      const message = handleIssuesResponse(organization, project, data);
      robot.messageRoom(chatRoom, message);  
    })  
  });
}

module.exports = function (robot) {
  new cron.CronJob({
    cronTime: '0 0 9 * * *',
    onTick: () => reportSentryStatus(robot, 'dev', `Just because you are a developer doesn’t mean don't have bugs:`),
    start: true,
    timeZone: 'Europe/Oslo',
  });

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
    reportSentryStatus(robot, res.message.room)
	})
};
