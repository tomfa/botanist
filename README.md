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
| anyone | [scripts/hearexample.js](https://github.com/tomfa/botanist/blob/master/scripts/hearexample.js) | Listening with ```hear``` |
| @botanic hello | [scripts/respondexample.js](https://github.com/tomfa/botanist/blob/master/scripts/respondexample.js) | Responding with ```respond``` |
| @botanic fancyhello | [scripts/fancyrespondexample.js](https://github.com/tomfa/botanist/blob/master/scripts/fancyrespondexample.js) | Responding with formatting |
| @botanic register | TODO | Responding with buttons/actions |
| @botanic weather | TODO | Using a 3rd party hubot script |
| @botanic run fish | TODO | Calling shell commands |
| @botanic short \<url\> | TODO | Integrating with 3rd party APIs |

## Deploy

1. In Slack, go to ```Apps & Integration```
2. Search and select ```Hubot```
3. Fill in the fields, and note down the API key
4. Set the environment variable ```export HUBOT_SLACK_TOKEN=your-slack-token```
5. Run with ```bin/hubot -a slack```

If you deploy to Heroku, do step 4: adding environment variable via the [Heroku dashboard](https://dashboard.heroku.com/apps), under your Application -> ```Settings``` -> ```Config Variables```

### Using other chat clients than Slack

TODO

