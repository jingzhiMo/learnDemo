module.exports = function(grunt) {
	grunt.initConfig({
		sprite: {
			all: {
				src: 'test/images/slice/*.png',
				dest: 'test/publish/images/sprite.png',
				destCss: 'test/publish/css/sprite.css',
				algorithm: 'top-down'  // 这个是图片排列的方向，有几个方向可以选择的，可以参考官方文档：https://www.npmjs.com/package/grunt-spritesmith#algorithms
			}
		}
	});

	// load task
	grunt.loadNpmTasks('grunt-spritesmith');

	// register task
	grunt.registerTask('default', ['sprite']);
};