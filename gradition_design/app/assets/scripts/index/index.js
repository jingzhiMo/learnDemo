var indexApp = angular.module('indexApp', ['pageMD', 'eventMD']);

indexApp.controller('indexCtrl', ['$scope', '$http', 'event', function($scope, $http, event) {

	$scope.goodList = []; // 物品的列表
	$scope.allGood = []; // 所有商品的信息
	$scope.currLen = 0; // 当前商品信息的下标
	$scope.searchResult = {
		good: [],  // 搜索名字的结果
		class: [], // 搜索类名的结果
		shop: []   // 搜索商店名字的结果
	};
	// $scope.isSearchOK = true;

	$scope.hasMore = true;


	/**
	 *  =good message init
	 *  @about  商品信息初始化
	 */
	(function() {
		$http({
			url: '/goodFetch',
			method: 'GET'
		})
		.success(function(data) {

			$scope.allGood = data;
			if ( data.length <= 10 ) {
				$scope.goodList = data;
				$scope.currLen = data.length;
			}
			else {
				$scope.goodList = data.slice(0, 10);
				$scope.currLen = 10;
			}
		})
		.error(function(err) {
			console.log('fetch good error');
		});
	})();


	/**
	 *  =load more
	 *  @about  加载更多的商品信息
	 *
	 *  @param  {number}  currLen  当前数据的长度
	 *  @param  {object}  ev       事件处理对象
	 */
	$scope.loadMore = function(currLen, ev) {
		var distance = 0;

		if ( $scope.currLen === $scope.allGood.length ) {
			$scope.hasMore = false;
		}
		else {
			console.log('还有更多的商品');
			distance = $scope.allGood.length - $scope.currLen;

			if ( distance <= 10 ) { // 已经是到了最后一页了
				$scope.goodList = $scope.allGood;
			}
			else {
				$scope.goodList = $scope.goodList.concat($scope.allGood.slice($scope.currLen, $scope.currLen + 10));
			}
			$scope.currLen = $scope.goodList.length;
		}
		event.stopProAndPreventDafault(ev);
	};


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
 				$scope.searchResult.good = data.good;
 				$scope.searchResult.shop = data.shop;
 				$scope.searchResult.class = data.class;
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
	 *  =close suggest block
	 *  @about  关闭提示搜索框
 	 */
 	$scope.closeSug = function() {
 		$scope.isSearchOK = false;
 	};
}])
.directive('catalog', ['event', function(event) {

	var positionX = 0;
	return {
		scope: {},
		restrict: 'E',
		repalce: true,
		templateUrl: '/assets/tmpl/catalog.html',
		link: function(scope, ele, attr) {

			var ul = ele.children()[0];
			event.move(ul, ul.offsetWidth / 2, 2, document.querySelectorAll('.point'));
		}
	};
}]);