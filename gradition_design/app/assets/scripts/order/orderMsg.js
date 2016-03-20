var order = angular.module('orderMsgMD', ['eventMD', 'pageMD', 'urlMD']);

order.controller('orMsgCtrl', ['$scope', '$http', '$location', 'calcUrlParam', 'event', 
function($scope, $http, $location, url, event){
	$scope.order = {};
	$scope.isPending = false;
	$scope.paySuc = false;
	$scope.btnMsg = '立即付款';

	var ID = url.getParamByUrl(window.location.href).orderID;

	if ( !ID ) {
		location.href = '/';
	}

	$http({
		method: 'GET',
		url: '/orderFetch?ID=' + ID + '&async=true'
	})
	.success(function(data) {
		if ( data.c === 302 ) {
			location.href = '/account.html?sourceUrl=' + location.href;
			return;
		}
		else if ( data === '' ) {
			location.href = '/';
		}
		else {
			$scope.order = data;
			$scope.order.good.goodCont = data.good.goodType === 1 ? ('代金券 ' + data.count + ' 张,价值' + data.sumPrice.toFixed(2) + '元') : data.good.goodCont;
			$scope.bookTime = parseDate($scope.order.beginTime);
			$scope.order.phone = $scope.order.phone.slice(0, 3) + '****' + $scope.order.phone.slice(7);
			switch($scope.order.status) {
				// 未付款，是默认值
				case 1:
				break;

				// 已付款，未评价
				case 2:
				$scope.btnMsg = '去评价';
				break;

				// 已付款，已评价
				case 3:
				$scope.btnMsg = '已完成';
				$scope.paySuc = true;
				break;

				// 已过期
				case 4:
				$scope.btnMsg = '已过期';
				$scope.paySuc = true;
				break;
			}
		}
	})
	.error(function() {
		console.log('获取订单信息失败');
	});


	/**
	 *  =pay order
	 *  @about  支付订单
	 */
	$scope.pay = function() {
		$http({
			method: 'POST',
			url: '/orderPay',
			data: {
				ID: ID,
				status: 2
			},
			headers: {
				'Content-type': 'application/json'
			}
		})
		.success(function(data) {
			if ( data.c === 302 ) {
				location.href = '/account.html?sourceUrl=' + location.href;
				return;
			} else if ( data.c === 0 ){
				$scope.paySuc = true;
				$scope.btnMsg = '已付款';
			}
			else {
				alert('支付失败');
			}
			
		})
		.error(function() {

		});
	};


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

		return  year + '-' + month + '-' + day + ' ' + hour + ':' + min;
	}
}]);