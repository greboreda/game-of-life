module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	grunt.registerTask('test', ['mocha']);
	//grunt.registerTask('default');
};