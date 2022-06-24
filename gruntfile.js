module.exports = function (grunt) {

	/**
   * [Just-in-time plugin loader: improve speed tasks]
   */
	require('jit-grunt')(grunt, {});

	/**
   * [Paths]
   */
	const jsPath = 'assets/js/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/**
     * [Task for keeping multiple browsers & devices in sync when building websites]
     */
		browserSync: {
			bsFiles: {
				src: [
					`${jsPath}**/*.js`,
					`index.html`,
				],
			},
			options: {
				watchTask: true,
				proxy: 'http://localhost/color-picker-bookmarklet/',
			},
		},
		/**
     * [Validate files with JSHint]
     */
		jshint: {
			options: {
				esversion: 6,
			},
			dist: [ `${jsPath}**/*.js`, `!${jsPath}**/*.transpiled.js`, `!${jsPath}**/*.min.js`, `!${jsPath}**/demo.js` ],
		},
		/**
     * [Babel transpiler]
     */
		babel: {
			options: {
				presets: [ '@babel/preset-env' ],
			},
			dist: {
				files: [ {
					expand: true,
					src: [ '**/*.js' ],
					cwd: jsPath,
					dest: jsPath,
					ext: '.transpiled.js',
				} ],
			},
		},
		/**
     * [Minify JavaScript files]
     */
		uglify: {
			dist: {
				files: [ {
					expand: true,
					src: [ '**/*.transpiled.js' ],
					cwd: jsPath,
					dest: jsPath,
					ext: '.min.js',
				} ],
			},
		},
		/**
	   * [Run tasks whenever watched files change]
	   */
		watch: {
			options: {
				spawn: false,
			},
			js: {
				files: [ `${jsPath}**/*.js` ],
				tasks: [ 'jshint', 'babel', 'uglify' ],
			},
		},
	});

	grunt.registerTask('default', [ 'browserSync', 'watch' ]);

	grunt.registerTask('build', [ 'jshint', 'babel', 'uglify' ]);
};
