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
	$scope.isShowBd = true;
	$scope.isShowFt = true;
	$scope.viewMore = false;
	$scope.packup = false;

	var urlReq = url.getParamByUrl(window.location.href);

	if ( !urlReq.ID ) { // 进入页面没有传商品的ID
		window.location.href = '/';
		return;
	}

	fetchShop()
	.then(fetchGood)
	.then(fetchChainShop);

	// 获取评论内容
	fetchEval(urlReq.ID);

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
		// var chainList = document.querySelectorAll('.shop-list')[0].children[0],
		// 	maxY = -(document.querySelectorAll('.shop-item')[0].offsetHeight) * 5; // 最多容下5个分店的信息
		// $scope.
		$scope.isShowShop = true;
		$scope.isShowBd = false;
		$scope.isShowFt = false;
		history.pushState({ischain: true}, null, '#chainShop');
		ev.preventDefault();
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

	$scope.backDetail = function() {
		if ( history.state && history.state.ischain ) {
			$scope.isShowShop = false;
			$scope.isShowBd = true;
			$scope.isShowFt = true;
		}
		history.back();
	};


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


	/**
	 *  =fetch evaluate message
	 *  @about  获取评论内容
	 *
	 *  @param  {string}  shopID  商家的ID
	 */
	function fetchEval(shopID) {
		$http({
			url: '/evalFetch?shopID=' + shopID + '&async=true',
			method: 'GET'
		})
		.success(function(data) {
			var maxLen = data.length,
				points = 0,
				eatPoints = 0,
				envirPoints = 0,
				servicePoints = 0,
				len = maxLen > 10 ? 10 : maxLen;

			for ( var i = 0; i < len; i++ ) {
				data[i].cont.timestamp = parseDate(data[i].cont.date);
				data[i].width = calcScore(data[i].cont.points.sum);
				points = points + data[i].cont.points.sum;
				eatPoints = eatPoints + data[i].cont.points.eat;
				envirPoints = envirPoints + data[i].cont.points.envir;
				servicePoints = servicePoints + data[i].cont.points.service;
			}
			
			for( i = len; i < maxLen; i++ ) {
				points = points + data[i].cont.points.sum;	
			}
			$scope.shopPoints = (points / maxLen).toFixed(2);
			$scope.eatPoints = (eatPoints / maxLen).toFixed(1);
			$scope.envirPoints = (envirPoints / maxLen).toFixed(1);
			$scope.servicePoints = (servicePoints / maxLen).toFixed(1);
			$scope.evalArr = data;
			console.log(data);
		})
		.error(function() {
			console.log('获取评论内容失败');
		});
	}


	/**
	  *  =parse date
	  *  @about  转化为日期 2016-01-01 10:00
	  *
	  *  @param  {string}  date  时间戳字符串
	 */
	function parseDate(datestr) {
		var date  = new Date(parseInt(datestr)),
			year  = date.getFullYear(),
			month = date.getMonth() + 1,
			day   = date.getDate(),
			hour  = date.getHours(),
			min   = date.getMinutes();

		month = month > 10 ? month : '0' + month;
		day = day > 10 ? day : '0' + day;
		hour = hour > 10 ? hour : '0' + hour;
		min = min > 10 ? min : '0' + min;

		return  year + '-' + month + '-' + day;
	}


	/**
	 *  =calculate score
	 *  @about  评分
	 *
	 *  @param  {number}  score 评分的多少
	 */
	function calcScore(score) {
		var width = '0%';

		switch(score) {
			case 1:
				width = '14%';
			break;
			case 2:
				width = '34%';
			break;
			case 3:
				width = '54%';
			break;
			case 4:
				width = '74%';
			break;
			case 5:
				width = '100%';
			break;
		}
		return width;
	};
}]);