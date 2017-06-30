module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			dist: {
			options: {
				transform: [["babelify", { "stage": 0 }]],
				browserifyOptions: {
					standalone: 'GameOfLife'
				}
			},
			files: {
				"build/gol.js": "game-of-life/index.js"
				}
			}
		},
		copy: {
			gameoflifeui: {
				files: [{
					cwd: 'game-of-life',
					dest: 'build/',
					src: 'gol-ui.js',
					expand: true
				}]
			}
		}

	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['browserify', 'copy:gameoflifeui']);
};