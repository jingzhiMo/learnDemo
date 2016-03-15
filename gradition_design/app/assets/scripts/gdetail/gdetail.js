var gdetail = angular.module('gdetail', ['urlMD', 'eventMD']);

gdetail.controller('gdCtrl', ['$scope', '$http', 'calcUrlParam', 'event', 
function($scope, $http, url, event){
	$scope.good = {};
	$scope.good.goodImg = ['assets/image/loading1.gif',
						   'assets/image/loading2.gif',
						   'assets/image/loading3.gif'];

	var urlReq = url.getParamByUrl(window.location.href);

	if ( !urlReq.ID ) { // 进入页面没有传商品的ID
		window.location.href = '/';
		return;
	}

	// $http({
	// 	url: '/goodFetch?ID=' + urlReq.ID,
	// 	method: 'GET'
	// })
	// .success(function(data) {
	// 	console.log(data);
	// 	$scope.good = data[0].good;
	// 	$scope.shop = data[0].shop;

	// 	// 处理预约提醒，使用规则，温馨提示三个数组
	// 	for(var i = 0; i < 3; i++) {
	// 		if ( $scope.good.tips.rule[i] === '' ) {
	// 			$scope.good.tips.rule.splice(i, 1);
	// 			i--;
	// 		}
	// 	}
	// 	for(i = 0; i < 3; i++) {
	// 		if ( $scope.good.tips.book[i] === '' ) {
	// 			$scope.good.tips.book.splice(i, 1);
	// 			i--;
	// 		}
	// 	}
	// 	for(i = 0; i < 3; i++) {
	// 		if ( $scope.good.tips.other[i] === '' ) {
	// 			$scope.good.tips.other.splice(i, 1);
	// 			i--;
	// 		}
	// 	}

	// 	// 处理时间段的提醒语
	// 	$scope.good.tips.useTime.other = $scope.good.tips.useTime.other || '法定节假日通用';
	// })
	// .error(function() {
	// 	// TODO
	// 	console.log('获取商品信息失败');
	// });
	getGood().then(getShopByID);


	/**
	 *  =get good
	 *  @about  获取商品信息
	 */
	function getGood() {
		var p = new Promise(function(resolve, reject) {

			$http({
				url: '/goodFetch?ID=' + urlReq.ID,
				method: 'GET'
			})
			.success(function(data) {
				console.log(data);
				$scope.good = data[0].good;
				$scope.shop = data[0].shop;

				// 处理预约提醒，使用规则，温馨提示三个数组
				for(var i = 0; i < 3; i++) {
					if ( $scope.good.tips.rule[i] === '' ) {
						$scope.good.tips.rule.splice(i, 1);
						i--;
					}
				}
				for(i = 0; i < 3; i++) {
					if ( $scope.good.tips.book[i] === '' ) {
						$scope.good.tips.book.splice(i, 1);
						i--;
					}
				}
				for(i = 0; i < 3; i++) {
					if ( $scope.good.tips.other[i] === '' ) {
						$scope.good.tips.other.splice(i, 1);
						i--;
					}
				}

				// 处理时间段的提醒语
				$scope.good.tips.useTime.other = $scope.good.tips.useTime.other || '法定节假日通用';

				resolve($scope.shop.ID);
			})
			.error(function() {
				// TODO
				console.log('获取商品信息失败');
			});
		});

		return p;
	}


	/**
	 *  =get shop by shop id
	 *  @about  通过商店的id，获取商店的信息
	 *
	 *  @param  {string}  shopID  商店的id
	 */
	function getShopByID(shopID) {
		$http({
			url: '/shopFetchWithGood?ID=' + shopID + '&fetchGood=true',
			method: 'GET'
		})
		.success(function(data) {
			console.log('商店的信息是');
			console.log(data);
		})
		.error(function(err) {
			// TODO
			console.log('过去商店信息失败');
		});
	}

	// 绑定滑动事件
	var slideBox = document.querySelectorAll('.slide-cont')[0],
		slideIdx = document.querySelectorAll('.index');
	event.move(slideBox, screen.width, 3, slideIdx);
}]);