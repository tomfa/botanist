// Description:
//   A simple testscript demonstrating robot router. To test, add
//   a github push hook from your repo towars /hubot/github-hooks,
//   or simply go to /hubot/tickle
//
// See https://developer.github.com/v3/activity/events/types/ for
// details on github hooks


function hubotFunctions(robot) {
  robot.router.get('/hubot/tickle', function(req, res) {
    robot.messageRoom('#general', 'Ouuuh, it tickles!');
    res.send(200);
  });
  robot.router.post('/hubot/github-hooks', function(req, res) {
    if (req.body.head_commit) {
      robot.messageRoom('#general',
        `Good job on that ${req.body.head_commit.id}, ${req.body.head_commit.committer.username}!`
      );
    } else {
      robot.messageRoom('#general',
        `TESTING TESTING! Copy hook ${req.body.hook.id}. (Thanks ${req.body.sender.login}!)`
      );
    }
    res.send(200);
  });
}

module.exports = hubotFunctions;
