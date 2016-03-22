var userApp = angular.module('userApp', ['pageMD', 'eventMD']);

userApp.controller('userCtrl', ['$scope', '$http', '$location', 'event', 
function($scope, $http, $location, event){

	$scope.unpay = 0;
	$scope.paied = 0;
	$scope.finish = 0;
	$scope.over = 0;

	fetchUserMsg().then(fetchOrderMsg);

	/**
	 *  =fetch user message
	 *  @about  获取用户信息
	 */
	function fetchUserMsg() {
		var p = new Promise(function(resolve) {
			$http({
				url: '/userFetch?async=true',
				method: 'GET'
			})
			.success(function(data) {
				if ( data.c === 302 ) {
					location.href = 'account.html?sourceUrl=' + location.href;
					return;
				}
				$scope.userMsg = data;
				resolve(data.ID);
			})
			.error(function() {
				console.log('获取信息失败');
			});
		});

		return p;
	}


	/**
	 *  =fetch order message
	 *  @about  获取订单信息
	 *
	 *  @param  {string}  userID  用户的ID
	 */
	function fetchOrderMsg(userID) {
		$http({
			url: '/orderFetchByUserID?userID=' + userID,
			method: 'GET'
		})
		.success(function(data) {
			if ( data.c === 302 ) {
				location.href = 'account.html?sourceUrl=' + location.href;
				return;
			}
			for( var i = 0, len = data.length; i < len; i++ ) {
				switch( data[i].status ) {
					// 未付款，是默认值
					case 1:
						$scope.unpay++;
					break;

					// 已付款，未评价
					case 2:
						$scope.paied++;
					break;

					// 已付款，已评价
					case 3:
						$scope.finish++;
					break;

					// 已过期
					case 4:
						$scope.over++;
					break;
				}
			}
		})
		.error(function() {
			console.log('获取该用户的订单信息失败');
		});
	}


	/**
	 *  =logout
	 *  @about  退出登录
	 */
	$scope.logout = function() {
		$http({
			url: '/logout',
			method: 'POST'
		})
		.success(function() {
			location.href = '/';
		})
		.error(function() {

		});
	};
}]);