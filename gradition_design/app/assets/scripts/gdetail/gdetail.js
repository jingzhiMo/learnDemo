var gdetail = angular.module('gdetail', ['urlMD', 'eventMD', 'pageMD']);

gdetail.controller('gdCtrl', ['$scope', '$http', 'calcUrlParam', 'event', 
function($scope, $http, url, event){
	$scope.good = {};
	$scope.recomGood = [];
	$scope.good.goodImg = ['assets/image/loading1.gif', 'assets/image/loading2.gif', 'assets/image/loading3.gif'];
	$scope.isShowPhone = false;
	$scope.isShowMask = false;
	$scope.goodPoints = 0;
	$scope.tag = [];

	/**
	 *  =show phone
	 *  @about  显示手机号码
	 */
	$scope.showPhone = function(ev) {
		$scope.isShowPhone = true;
		$scope.isShowMask = true;
		event.stopProAndPreventDafault(ev);
	};


	$scope.hidePhone = function(ev) {
		$scope.isShowPhone = false;
		$scope.isShowMask = false;
		event.stopProAndPreventDafault(ev);	
	};


	/**
	 *  =purchase good
	 *  @about  购买商品
	 */
	$scope.purchase = function() {
		localStorage.setItem('goodName', $scope.good.goodName);
	};

	var urlReq = url.getParamByUrl(window.location.href);

	if ( !urlReq.ID ) { // 进入页面没有传商品的ID
		window.location.href = '/';
		return;
	}

	getGood()
	.then(getShopByID);
	// 获取评论内容
	fetchEval(urlReq.ID);


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
	 *  @about  通过商店的id，获取其他商品的信息
	 *
	 *  @param  {string}  shopID  商店的id
	 */
	function getShopByID(shopID) {
		$http({
			url: '/shopFetchWithGood?ID=' + shopID + '&fetchGood=true',
			method: 'GET'
		})
		.success(function(data) {
			for( var i = 0, len = data.length; i < len; i++ ) {
				if ( $scope.good.ID === data[i].ID ) {
					data.splice(i, 1);
					break;
				}
			}
			$scope.recomGood = data;
		})
		.error(function(err) {
			// TODO
			console.log('获取商店信息失败');
		});
	}


	/**
	 *  =fetch evaluate message
	 *  @about  获取评论内容
	 *
	 *  @param  {string}  goodID  商品的ID
	 */
	function fetchEval(goodID) {
		$http({
			url: '/evalFetch?goodID=' + goodID + '&async=true',
			method: 'GET'
		})
		.success(function(data) {
			var maxLen = data.length,
				points = 0,
				len = maxLen > 10 ? 10 : maxLen;

			for ( var i = 0; i < len; i++ ) {
				data[i].cont.timestamp = parseDate(data[i].cont.date);
				data[i].width = calcScore(data[i].cont.points.sum);
				points = points + data[i].cont.points.sum;

				if ( data[i].cont.points.eat >= 3 ) {
					$scope.tag[0] = $scope.tag[0] + 1 || 1;
				}
				if ( data[i].cont.points.service >= 3 ) {
					$scope.tag[1] = $scope.tag[1] + 1 || 1;	
				}
				if ( data[i].cont.points.envir >= 3 ) {
					$scope.tag[2] = $scope.tag[2] + 1 || 1;
				}
				if ( data[i].cont.points.sum >= 3 ) {
					$scope.tag[3] = $scope.tag[3] + 1 || 1;
				}
			}
			
			for( i = len; i < maxLen; i++ ) {
				points = points + data[i].cont.points.sum;

				if ( data[i].cont.points.eat >= 3 ) {
					$scope.tag[0] = $scope.tag[0] + 1 || 1;
				}
				if ( data[i].cont.points.service >= 3 ) {
					$scope.tag[1] = $scope.tag[1] + 1 || 1;	
				}
				if ( data[i].cont.points.envir >= 3 ) {
					$scope.tag[2] = $scope.tag[2] + 1 || 1;
				}
				if ( data[i].cont.points.sum >= 3 ) {
					$scope.tag[3] = $scope.tag[3] + 1 || 1;
				}
			}
			$scope.goodPoints = ((points || 5) / (maxLen || 1)).toFixed(2);
			$scope.evalArr = data;
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
	}

	// 绑定滑动事件
	var slideBox = document.querySelectorAll('.slide-cont')[0],
		slideIdx = document.querySelectorAll('.index');
	event.move(slideBox, screen.width, 3, slideIdx);

	// 绑定导航栏事件
	var nav = document.querySelector('#nav-box'),
		navItem = nav.querySelectorAll('.nav-item');

	event.navScroll(nav, navItem);
}]);