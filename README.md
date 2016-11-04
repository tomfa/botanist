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
| @botanic register | TODO | How to respond with buttons/actions |
| @botanic weather | TODO | How to use a 3rd party hubot script |
| @botanic run fish | TODO | How to call shell commands |
| @botanic short \<url\> | TODO | How to integrate with 3rd party HTTP APIs |
| N/A | TODO | How to program bot with ES2015 |

## Deploy

1. In Slack, go to ```Apps & Integration```
2. Search and select ```Hubot```
3. Fill in the fields, and note down the API key
4. Set the environment variable ```export HUBOT_SLACK_TOKEN=your-slack-token```
5. Run with ```bin/hubot -a slack```

If you deploy to Heroku, do step 4: adding environment variable via the [Heroku dashboard](https://dashboard.heroku.com/apps), under your Application -> ```Settings``` -> ```Config Variables```

### Using other chat clients than Slack

TODO

