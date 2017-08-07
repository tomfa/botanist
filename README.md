# botanist

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

botanist is a chat bot built on the [Hubot](https://hubot.github.com/) framework,
that demonstrates common features of hubot, using JavaScript. Its purpose is to
kickstart developers who wish to start using Hubot, but wish to use JavaScript
instead of Coffeescript.

It's generated to integrate with [Slack](https://www.slack.com/), but can easily
be updated to support one of [Hubots many adapters](https://hubot.github.com/docs/adapters/).

For those that want to use Coffeescript, [Hubots own documentation](https://hubot.github.com/docs/) should suffice.

## Examples

| trigger word | file | description |
| ------------ | ---- | ----------- |
| anyone | [scripts/hearexample.js](https://github.com/tomfa/botanist/blob/master/scripts/hearexample.js) | How to eavesdrop to a channel and say something, using ```hear``` |
| @botanic hello | [scripts/respondexample.js](https://github.com/tomfa/botanist/blob/master/scripts/respondexample.js) | How to respond to a mention, using ```respond``` |
| @botanic help hello | [scripts/respondexample.js](https://github.com/tomfa/botanist/blob/master/scripts/respondexample.js) | How to document your bot functions |
| @botanic fancyhello | [scripts/fancyrespondexample.js](https://github.com/tomfa/botanist/blob/master/scripts/fancyrespondexample.js) | How to respond with rich formatting |
| @botanic have a soda | [scripts/variablesexample.js](https://github.com/tomfa/botanist/blob/master/scripts/variablesexample.js) | How to store and retrieve variables |
| @botanic es6 | [scripts/es6example.js](https://github.com/tomfa/botanist/blob/master/scripts/es6example.js) | Hubot runs on Node, and will therefore support ES2015 |
| @botanist github pulls | [scripts/githubexample.js](https://github.com/tomfa/botanist/blob/master/scripts/githubexample.js) | Github integration example |
| @botanist trello status | [scripts/trelloexample.js](https://github.com/tomfa/botanist/blob/master/scripts/trelloexample.js) | Trello integration example |
| N/A | [scripts/startupexample.js](https://github.com/tomfa/botanist/blob/master/scripts/startupexample.js) | Message sent on startup |


## Deploy

1. In Slack, go to ```Apps & Integration```
2. Search and select ```Hubot```
3. Fill in the fields, and note down the API key
4. Set the environment variable ```export HUBOT_SLACK_TOKEN=your-slack-token```
5. Run with ```bin/hubot -a slack```

### Deploying to Heroku
If you have [Heroku toolbelt](https://devcenter.heroku.com/articles/heroku-cli), you can deploy the bot with the commands below
```
heroku create
heroku config:set HUBOT_SLACK_TOKEN=your-slack-token
git push heroku master
```

*(Remember to swap out "your-slack-token" with your actual one)*

### Keeping the bot alive on Heroku
With the commands below, you'll also make sure your bot is awake between 6am and 22pm, using [hubot-heroku-keepalive](https://github.com/hubot-scripts/hubot-heroku-keepalive).

```
heroku config:set HUBOT_HEROKU_KEEPALIVE_URL=$(heroku apps:info -s | grep web.url | cut -d= -f2)
heroku config:add TZ="Europe/Oslo"
heroku addons:create scheduler:standard
heroku addons:open scheduler
```

In the config page for scheduler, add job with command `curl ${HUBOT_HEROKU_KEEPALIVE_URL}heroku/keepalive` and run it at 5am UTC (no earlier than [hubot-heroku-keepalive](https://github.com/hubot-scripts/hubot-heroku-keepalive) is configured to begin)
