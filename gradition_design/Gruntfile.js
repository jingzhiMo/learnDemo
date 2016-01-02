module.exports = function(grunt) {

	// 引入加载全部插件的插件
	require('load-grunt-tasks')(grunt);
	// 引入显示每次构建任务所需要的时间
	require('time-grunt')(grunt);


	grunt.initConfig({

		// 读取 package.json 的文件，获取版本号等等
		pkg: grunt.file.readJSON('package.json'),

		// 路径
		path: {
			assets: {
				index:   './app/assets/',
				scripts: './app/assets/scripts/',
				sass:    './app/assets/sass/',
				css:     './app/assets/css/'
			},
			dist: {
				index:   './app/dist/',
				scripts: './app/dist/scripts/',
				css:     './app/dist/css/'
			}
		},

		// 合并文件
		concat: {
			js: {

			}
		},


		// 压缩 js 文件
		uglify: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= path.assets.scripts %>',
					src: '*/*.js',
					dest: '<%= path.dist.scripts %>',
					ext: '.min.js'
				}],
				options: {
					banner: ''
				}
			}
		},


		// 压缩 css 文件
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= path.assets.css %>',
					src: '*/*.css',
					dest: '<%= path.dist.css %>',
					ext: '.min.css'
				}],
				options: {
					banner: ''
				}
			}
		},


		// js 语法检查
		jshint: {
			// front-end
			fe: {
				files: [
					'<%= path.assets.scripts %>*/*.js',
				],
				options: {
					eqeqeq: true,
					curly: true,
					newcap: true,
					sub: true,
					undef: true,
					boss: true,
					globals: {
						window: true,
						document: true,
						console: true,
						angular: true
					}
				}
			},
			// back-end
			be: {
				files: [{

				}],
				options: {
					eqeqeq: true,
					curly: true,
					newcap: true,
					sub: true,
					undef: true,
					boss: true,
					globals: {

					},
					node: true // 执行环境为 node
				}
			}
		},


		// sass 预编译
		sass: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= path.assets.sass %>',
					src: '*/*.scss',
					dest: '<%= path.assets.css %>',
					ext: '.css'
				}],
				options: {
					sourcemap: 'auto',
					style: 'expanded'
				}
			}
		},


		// 监听文件变化
		watch: {
			// sass 变化，预编译成 css
			buildSass: {
				files: [
					'<%= path.assets.sass %>*/.scss'
				],
				tasks: [
					'sass'
				],
				options: {
					livereload: true
				}
			},

			// js 变化，语法检查
			instinctJs: {
				files: [
					'<%= path.assets.scripts %>*/*.js'
				],
				tasks: [
					'jshint'
				],
				options: {
					livereload: true
				}
			}
		}

	});


	// 注册任务
	grunt.registerTask('default', ['cssmin']);
	// 监听文件变化
	grunt.registerTask('live', ['watch']);
};