// Description:
//   A simple testscript demonstrating "hear" function
//
// Commands:
//   anyone - upon hearing the word "anyone", responds enthusiastically

module.exports = function (robot) {
	robot.hear(/anyone/ ,function(res){
		res.send("Pick me! Pick me!");
	})
}