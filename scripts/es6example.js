// Description:
//   A simple testscript demonstrating code written with es2015
//
// Commands:
//   es6 - sends a response written i ES6

module.exports = robot => {
	robot.respond(/es6/ , res => {
		res.send(`
		   Hubot runs on node, which means you can code whatever
		   javascript node intereprets. Node versions >= 6 tend
		   to support es2015. If you need build steps, add the
		   files in a folder 'src', and the resulting scripts
		   in the script folder.
		`);
	});
};
