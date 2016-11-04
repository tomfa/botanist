// Description:
//   A simple testscript demonstrating "hear" function
//
// Commands:
//   hubot hello - will say hi back in one way or another


module.exports = function (robot) {
	robot.respond(/hello/ ,function(res){
		var welcomes = ["Hola!", "Hei!", "Bonjour!", "Aww, not you again", "Hello to you too"]
		res.reply(res.random(welcomes));
	})
}