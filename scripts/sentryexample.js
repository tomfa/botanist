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

const getRandomGreeting = () => {
  const quotes = [
    "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
    "A misplaced decimal point will always end up where it will do the greatest damage.",
    "A computer program does what you tell it to do, not what you want it to do.",
    "Any fool can program. Many do.",
    "Hey! It compiles! Ship it!",
    "Guns don’t kill people. Bad code kills people.",
    "God is real, unless declared integer.",
    "First, solve the problem. Then, write the code.",
    "Experience is the name everyone gives to their mistakes.",
    "Computers make very fast, very accurate mistakes.",
    "Computers do not solve problems, they execute solutions.... Which often creates new problems.",
    "If brute force doesn’t solve your problems, then you aren’t using enough.",
    "It works on my machine.",
    "Only half of programming is coding. The other 90% is debugging.",
    "Pasting code from the Internet into production code is like chewing gum found in the street.",
    "Profanity is the one language all programmers know best.",
    "The best thing about a boolean is even if you are wrong, you are only off by a bit.",
    "There is nothing quite so permanent as a quick fix.",
    "There’s no test like production.",
    "To err is human, but you really screwed up here.",
    `Ubuntu is an ancient African word, meaning "can’t configure Debian"`,
    "Weeks of coding can save you hours of planning.",
    "Who is General Failure? And why is he inside cloud?",
    "You start coding. I’ll go find out what they want.",
    "It’s kind of fun to do the impossible.",
    "Just don’t create a file called -rf.",
    "Let’s call it an accidental feature.",
    "One man’s constant is another man’s variable.",
    "The greatest performance improvement of all is when a system goes from not-working to working.",
    "Software is like sex: It’s better when it’s free. And without bugs.",
    "The problem with troubleshooting is that trouble shoots back.",
    "When in doubt, leave it out.",
    "We cannot learn without pain.",
    `Without requirements or design, programming is the art of adding bugs to an empty "text" file.`,
    "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday’s code.",
    "Developer: an organism that turns lunch and coffee into bugs. Much like plain time does.",
    "One man´s crappy software is another man´s full time job.",
    "It´s okay to figure out murder mysteries, but you shouldn´t need to figure out code. You should be able to read it.",
    "Plan to throw one (implementation) away; you will, anyhow.",
    "Perfection (in design) is achieved not when there is nothing more to add, but rather when there is nothing more to take away.",
    "Prolific programmers contribute to certain disaster.",
    'TimeoutException during message: "It´s better to wait for a productive programmer to become available than it is to ..." at anna.internals:14',
    "The key to performant code is not battalions of special cases.",
    "Inside every large program, there is a program trying to get out.",
    "Why do we never have time to do it right, but always have time to do it over?",
    "The goal of Computer Science is to build something that will last at least until we´ve finished building it. ",
    "The best performance improvement is the transition from the nonworking state to the working state.",
    "No matter what the problem is, it´s always a people problem.",
    "The best way to fix these issues is trying.",
    "Let me just change this one line of code...",
    "Fast, User-friendly, Bug free. Pick two.",
    "Did you know? The collective noun for a group of programmers is a merge-conflict.",
    "If there is no struggle, there is no progress.",
    "A person who never made a mistake never tried anything new.",
    "Success is not forever and failure isn´t fatal.",
    "The secret of getting ahead is getting started.",
    "Apparently there is nothing that cannot happen today.",
    "Talk is cheap, show me the code!",
    "They did not know it was impossible, so they did it!",
    '"If I had more time, I would have written code that works", you say?',
    "The older I get, the more I believe that the only way to become a better programmer is by not programming.",
    '"That hardly ever happens" is another way of saying "it happens".',
    "Good is the enemy of great, but great is the enemy of shipped.",
    "If the programmers like each other, they play a game called 'pair programming'. And if not then the game is called 'peer review'. The good news is that you seem to like each other :heart:. The bad news is that no one reviewed the code",
    "The proper use of comments is to compensate for our failure to express ourself in code. I bet there's a comment right there around line 77:",
    "Code is like humor. When you have to explain it, it's bad. Seems like you got some explaining to do...",
    "Fix the cause, not the symptom.",
    "Programmers are constantly making things more complicated than they need to be BECAUSE FUTURE. Fuck the future. Program for today.",
    "Code never lies, and this code is screaming about malnurishment!"
  ];
  return quotes[Math.floor(Math.random()*quotes.length)];
}

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
              "title": "Event count last 24h (total)",
              "value": `${maxErrorIssue.lastDayIssuesNum} (${maxErrorIssue.count})`,
              "short": true
            },
            {
              "title": "Assignee",
              "value": maxErrorIssue.assignedTo && maxErrorIssue.assignedTo.name || "*None!*",
              "short": true
            },
            {
              "title": "Culprit",
              "value": maxErrorIssue.culprit,
              "short": true
            },
            {
              "title": "First seen",
              "value": new Date(maxErrorIssue.firstSeen).toDateString().substr(4),
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
    robot.messageRoom(chatRoom, getRandomGreeting());
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
    onTick: () => reportSentryStatus(robot, 'dev', true),
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
