// This module only concats all the contents of the current directory into a single array
var fs = require('fs');
var path = require('path');
module.exports = fs.readdirSync(__dirname).reduce(function (acc, filename) {
	if (filename == 'index.js' || /.js$/.test(filename))
		return acc;
	var testCases = require(path.join(__dirname, filename));
	console.log(testCases);
	return acc.concat(testCases);
}, [])