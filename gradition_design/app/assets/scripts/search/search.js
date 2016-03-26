var searchApp = angular.module('searchApp', ['pageMD', 'eventMD', 'urlMD']);

searchApp.controller('searchCtrl', ['$scope', '$http', 'event', 'calcUrlParam', function($scope, $http, event, url) {

	$scope.searchResult = {
		good: [],
		shop: []
	};

	var key    = url.getParamByUrl(location.href).key,
		type   = url.getParamByUrl(location.href).type,
		allUrl = {
			'goodName': '/goodFetch?goodName=' + key,
			'shopName': '/shopFetch?shopName=' + key,
			'goodClass': '/goodFetch?goodClass=' + key
		};
		reqUrl = allUrl[type];

	$http({
		url: reqUrl,
		method: 'GET'
	})
	.success(function(data) {
		if ( type === 'shopName' ) {
			fetchGoodById(data);
		}
		else {
			$scope.searchResult.good = data;
		}
	})
	.error(function() {
		console.log('获取失败');
	});


	/**
	 *  =fetch good by id
	 *  @about  获取商品的信息，通过商店的ID
	 *
	 *  @param  {ayyay}  shopMsg  商家的信息
	 */
	function fetchGoodById(shopMsg) {
		for( var i = 0, len = shopMsg.length; i < len; i++ ) {
			(function(i) {
				$http({
					url: '/shopFetchWithGood?ID=' + shopMsg[i].ID
				})
				.success(function(data) {
					var msg = {
						shop: shopMsg[i],
						good: data
					};
					$scope.searchResult.shop.push(msg);
					console.log('商店的信息');
					console.log($scope.searchResult.shop);
				})
				.error(function() {
					console.log('获取失败');
				});
			})(i);
		}
	}
}]);