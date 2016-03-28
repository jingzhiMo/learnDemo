angular.module('pageMD', ['adminMD'])
	.service('pageHd', function(){
		
	})
	.service('history', function(){

		return {
			/**
			 *  =history back
			 *  @about  后退按钮
			 */
			historyBack: function() {
				history.back();
			},


			/**
			 *  =history add
			 *  @about  添加一个历史记录
			 */
			historyAdd: function() {
				// TODO 每次切换页面视图都要增加一个历史记录	
			}
		};
	})
	.controller('pageHdCtrl', ['$scope', 'history', function($scope, history){
		$scope.homeLink = '/';

		/**
		 *  =back
		 *  @about    后退
		 */
		$scope.back = function() {
			history.historyBack();
		};
	}])
	.controller('pageFtCtrl', ['$scope', 'checkAdmin', function($scope, checkAdmin){
		$scope.showTop = true;

		// 检查是不是管理员
		checkAdmin(function(data) {
			if ( data.c === 0 ) {
				$scope.isAdmin = true;
			}
		});


		/**
		 *  =go to top
		 *  @about  返回顶部
		 */
		$scope.gotoTop = function() {
			window.scrollTo(0, 0);
		};

		
		// 监听滚动条的滚动，到达一定程度，显示返回顶部的按钮
		var timer = null,
			scrollTop = 0;
		window.addEventListener('scroll', function(ev) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				scrollTop = window.scrollY;
				if ( scrollTop > 100 ) {
					$scope.showTop = true;
				}
				else {
					$scope.showTop = false;	
				}
			}, 200);
		}, false);
	}]);