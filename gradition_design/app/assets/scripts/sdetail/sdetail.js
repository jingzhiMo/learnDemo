var sdetail = angular.module('sdetail', ['urlMD', 'eventMD', 'pageMD']);

sdetail.controller('sdCtrl', ['$scope', '$http', 'calcUrlParam', 'event', 
function($scope, $http, url, event){
	$scope.shop = {};
	$scope.goodList = []; // 商店的商品
	$scope.viewGoodList = []; // 显示的商店的商品
	$scope.chainShopList = []; // 分店
	$scope.shop.shopImg = ['assets/image/loading1.gif'];
	$scope.isShowPhone = false;
	$scope.isShowMask = false;
	$scope.isShowShop = false;
	$scope.viewMore = false;
	$scope.packup = false;

	/**
	 *  =show phone
	 *  @about  显示手机号码
	 */
	$scope.showPhone = function(ev) {
		$scope.isShowPhone = true;
		$scope.isShowMask = true;
		event.stopProAndPreventDafault(ev);
	};


	/**
	 *  =hide phoen
	 *  @about  隐藏手机号码
	 */
	$scope.hidePhone = function(ev) {
		$scope.isShowPhone = false;
		$scope.isShowMask = false;
		event.stopProAndPreventDafault(ev);	
	};


	/**
	 *  =view more or pack up
	 *  @about  展开所有商品或者收起
	 */
	$scope.toggleMore = function(ev) {
		$scope.viewMore = !$scope.viewMore;
		$scope.packup = !$scope.packup;
		$scope.viewGoodList = $scope.packup ? $scope.goodList : $scope.goodList.slice(0, 2);
		event.stopProAndPreventDafault(ev);
	};


	/**
	 *  =view all shop
	 *  @about  查看所有商店
	 */
	$scope.viewAllShop = function(ev) {
		var chainList = document.querySelectorAll('.shop-list')[0].children[0],
			maxY = -(document.querySelectorAll('.shop-item')[0].offsetHeight) * 5; // 最多容下5个分店的信息

		$scope.isShowShop = true;
		$scope.isShowMask = true;
		event.moveY(chainList, maxY);
		event.stopProAndPreventDafault(ev);
	};


	/**
	 *  = close shop popup
	 *  @about  关闭显示所有分店的弹出框
	 */
	$scope.closeShopPopup = function(ev) {
		$scope.isShowShop = false;
		$scope.isShowMask = false;
		event.stopProAndPreventDafault(ev);
	};

	var urlReq = url.getParamByUrl(window.location.href);

	if ( !urlReq.ID ) { // 进入页面没有传商品的ID
		window.location.href = '/';
		return;
	}

	fetchShop()
	.then(fetchGood)
	.then(fetchChainShop);


	/**
	 *  =get shop
	 *  @about  获取商店信息
	 */
	function fetchShop() {
		var p = new Promise(function(resolve) {

			$http({
				url: '/shopFetch?ID=' + urlReq.ID,
				method: 'GET'
			})
			.success(function(data) {
				console.log(data);
				$scope.shop = data[0];
				resolve(data[0].ID);
			})
			.error(function() {
				console.log('fetch shop error');
			});
		});

		return p;
	}


	/**
	 *  =fetch good
	 *  @about  获取商店的商品
	 *
	 *  @param  {string}  shopID  商家的ID
	 */
	function fetchGood(shopID) {
		var p = new Promise(function(resolve) {
			$http({
				url: '/shopFetchWithGood?ID=' + shopID,
				method: 'GET'
			})
			.success(function(data) {
				$scope.goodList = data;
				if ( data.length > 2 ) {
					$scope.viewGoodList = data.slice(0, 2);
					$scope.viewMore = true;
				}
				else {
					$scope.viewGoodList = data;
				}
				resolve();
			})
			.error(function() {
				console.log('获取商店所有商品的时候出错');
			});
		});

		return p;
	}


	/**
	 *  =get chain shop
	 *  @about  获取连锁商店的信息
	 */
	function fetchChainShop() {
		var shopID = $scope.shop.chainID;

		$http({
			url: '/shopFetch?chainID=' + shopID,
			method: 'GET'
		})
		.success(function(data) {			
			console.log('连锁店的信息');
			$scope.chainShopList = data;
			console.log(data);
		})
		.error(function() {
			console.log('获取连锁店信息出错');
		});
	}
}]);