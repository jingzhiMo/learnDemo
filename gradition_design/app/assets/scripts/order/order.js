var order = angular.module('orderMD', ['eventMD', 'pageMD', 'urlMD']);

order.controller('orCtrl', ['$scope', '$http', '$location', 'calcUrlParam', 'event', 
function($scope, $http, $location, url, event){
	var param = url.getParamByUrl(window.location.href);

	$scope.goodName = localStorage.getItem('goodName');
	$scope.price = param.price;
	$scope.phone = param.phone;
	$scope.shopID = param.shopID;
	$scope.goodID = param.goodID;
	$scope.canPlus = true;
	$scope.canMinus = false;

	$scope.isPending = false;
	$scope.count = 1;


	/**
	 *  =minus
	 *  @about  减少份数
	 */
	$scope.minus = function() {
		$scope.count = $scope.count <= 1  || $scope.count === '' ? 1 : $scope.count - 1;
	};


	/**
	 *  =plus
	 *  @about  增加份数
	 */
	$scope.plus = function() {
		$scope.count = $scope.count >= 10 ? 10 : $scope.count + 1;
	};


	/**
	 * @about  监听份数的变化，不能输入非数字
	 */
	$scope.$watch('count', function(newVal, oldVal) {
		if ( newVal === '' ) {
			return;
		}
		newVal = parseInt(newVal);
		if ( newVal >= 1 && newVal <= 10 ) {
			$scope.count = newVal;
		}
		else {
			$scope.count = oldVal;
		}
		$scope.canMinus = $scope.count <= 1 ? false : true;
		$scope.canPlus = $scope.count >= 10 ? false : true;
	});


	/**
	 *  =submit order
	 *  @about  提交订单
	 */
	$scope.submitOrder = function() {
		$scope.isPending = true;
		$http({
			url: '/orderAdd',
			method: 'POST',
			data: {
				goodID: $scope.goodID,
				shopID: $scope.shopID,
				count: $scope.count
			},
			headers: {
				'Content-type': 'application/json'
			}
		})
		.success(function(data) {
			if ( !data.c ) {
				$scope.isPending = false;
				window.location.href = '/orderMsg.html?orderID=' + data.ID;
			}
			else if ( data.c === 302 ) { // 用户没登陆，重定向到登录页面
				window.location.href = '/account.html?sourceUrl=' + window.location.href;
			}
		})
		.error(function() {
			// TODO
			alert('提交失败');
			$scope.isPending = false;
		});
	};
}]);