var searchApp = angular.module('searchApp', ['pageMD', 'eventMD', 'urlMD']);

searchApp.controller('searchCtrl', ['$scope', '$http', 'event', 'calcUrlParam', function($scope, $http, event, url) {

	var key    = url.getParamByUrl(location.href).key,
		type   = url.getParamByUrl(location.href).type,
		allUrl = {
			'goodName': '/goodFetch?goodName=' + key,
			'shopName': '/shopFetch?shopName=' + key,
			'goodClass': '/goodFetch?goodClass=' + key
		};
		reqUrl = allUrl[type];

	$scope.searchResult = {
		good: [],
		shop: []
	};
	$scope.searchTip = {
		good: [],
		shop: []
	};
	$scope.key = key;
	$scope.isSearchOK = false;

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
	 *  =search = by keyboard
	 *  @about  键盘输入的时候，进行搜索
	 */
	var timer = null;
	$scope.searchByKeyboard = function() {
		// console.log('key');
		clearTimeout(timer);
		timer = setTimeout(function() {
			if ( !$scope.key ) {
				return;
			}
			$scope.search();
		}, 1500);
	};


	/**
	 *  =search good
	 *  @about  搜索商品信息
 	 */
 	$scope.search = function() {
 		$http({
 			url: '/search?key=' + $scope.key,
 			method: 'GET'
 		})
 		.success(function(data) {
 			console.log(data);
 			if ( data.good.length || data.shop.length || data.class.length ) {
 				$scope.isSearchOK = true;
 				$scope.searchTip.good = data.good;
 				$scope.searchTip.shop = data.shop;
 				$scope.searchTip.class = data.class;
 			}
 			else {
 				$scope.isSearchOK = false;
 			}
 			
 		})
 		.error(function() {
 			console.log('search error');
 		});
 	};


 	/**
	 *  =close suggest box
	 *  @about  关闭搜索提示框
 	 */
	$scope.closeSug = function() {
		$scope.isSearchOK = false;
	};


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