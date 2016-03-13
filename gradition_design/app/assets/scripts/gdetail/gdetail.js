var gdetail = angular.module('gdetail', ['urlMD']);

gdetail.controller('gdCtrl', ['$scope', '$http', 'calcUrlParam', function($scope, $http, url){
	$scope.good = {};
	$scope.good.goodImg = ['assets/image/loading1.gif',
						   'assets/image/loading2.gif',
						   'assets/image/loading3.gif'];

	var urlReq = url.getParamByUrl(window.location.href);

	if ( !urlReq.ID ) { // 进入页面没有传商品的ID
		window.location.href = '/';
		return;
	}

	$http({
		url: '/goodFetch?ID=' + urlReq.ID,
		method: 'GET'
	})
	.success(function(data) {
		console.log(data);
		$scope.good = data[0].good;
		$scope.shop = data[0].shop;
	})
	.error(function() {
		// TODO
		console.log('获取商品信息失败');
	});
}]);