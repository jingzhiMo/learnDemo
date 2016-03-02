angular.module('pageMD', [])
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
	}]);