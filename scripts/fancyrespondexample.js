// Description:
//   A simple testscript demonstrating advanced message formatting
//
// Commands:
//   hubot fancyhello - shows example of a fancy message formatting


module.exports = function (robot) {
	robot.respond(/fancyhello/, function(res){
		var response = {
		    "attachments": [
		        {
		            "fallback": "Required plain-text summary of the attachment.",
		            "color": "#36a64f",
		            "pretext": "Optional text that appears above the attachment block",
		            "author_name": "Bobby Tables",
		            "author_link": "http://flickr.com/bobby/",
		            "author_icon": "http://flickr.com/icons/bobby.jpg",
		            "title": "Slack API Documentation",
		            "title_link": "https://api.slack.com/",
		            "text": "Optional text that appears within the attachment",
		            "fields": [
		                {
		                    "title": "Priority",
		                    "value": "High",
		                    "short": true
		                },
		                {
		                    "title": "Assignee",
		                    "value": "Tomas",
		                    "short": true
		                }
		            ],
		            //"image_url": "http://pngimg.com/upload/fish_PNG1157.png",
		            "thumb_url": "https://img1.etsystatic.com/017/0/6966518/il_75x75.504492969_dzp8.jpg",
		            "footer": "Slack API",
		            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
		            "ts": 123456789
		        }
		    ]
		}
		res.send(response);
	})
}