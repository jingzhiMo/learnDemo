var searchApp = angular.module('searchApp', ['pageMD', 'eventMD', 'urlMD']);

searchApp.controller('searchCtrl', ['$scope', '$http', 'event', 'calcUrlParam', function($scope, $http, event, url) {

	var key    = url.getParamByUrl(location.href).key,
		type   = url.getParamByUrl(location.href).type,
		allUrl = {
			'goodName': '/goodFetch?goodName=' + key,
			'shopName': '/shopFetch?shopName=' + key,
			'goodClass': '/goodFetch?goodClass=' + key,
			'goodAll': '/shopFetch?ID=s'
		};
		reqUrl = allUrl[type];

	// 搜索之后显示内容的数据
	$scope.searchResult = {
		good: [],
		shop: [], // 能够显示出来的商品，因为每个商家初始化，只能显示三个
		hideShop: [], // 每个商家，超出三个商品之后，存储的数据，当点击，查看全部的时候，就会调用这里的数据
		hideFlag: [] // 超出三个商品，隐藏更多的项目
	};
	// 搜索之后，现在在搜索框提示的数据
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
		if ( type === 'shopName' || type === 'goodAll') {
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
	 *  =view more good
	 *  @about  查看更多商品信息
	 *
	 *  @param  {number}  index  下标
 	 */
 	$scope.viewMore = function(index) {
 		$scope.searchResult.shop[index].good = $scope.searchResult.shop[index].good.concat($scope.searchResult.hideShop[index]);
 		$scope.searchResult.hideFlag[index] = false;
 	};


 	/**
	 *  =close more
	 *  @about  收起更多商品
	 *
	 *  @param  {number}  index  下标
 	 */
 	$scope.closeMore = function(index) {
 		$scope.searchResult.shop[index].good = $scope.searchResult.shop[index].good.slice(0, 3);
 		$scope.searchResult.hideFlag[index] = true;
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
					var shopLen = $scope.searchResult.shop.length;

					if ( data.c !== -2 ) {
						var msg = {
							shop: shopMsg[i],
							good: data
						};
						// 只取前三个，初始化显示在页面当中
						msg.good = data.slice(0, 3);
						// 把超出三个的，先隐藏起来
						$scope.searchResult.hideShop[shopLen] = data.length > 3 ? data.slice(3) : [];
						$scope.searchResult.hideFlag[shopLen] = true;
						$scope.searchResult.shop.push(msg);
					}
				})
				.error(function() {
					console.log('获取失败');
				});
			})(i);
		}
	}
}]);