module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			development: {
				files: {
					'build/game-of-life.css': 'less/game-of-life.less'
				}
			}
		},
		browserify: {
			dist: {
				files: {
					'build/gol.js': 'game-of-life/index.js'
				},
				options: {
					transform: [['babelify', { 'stage': 0 }]],
					browserifyOptions: {
						standalone: 'gol'
					}
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

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['browserify', 'copy:gameoflifeui', 'less']);
};