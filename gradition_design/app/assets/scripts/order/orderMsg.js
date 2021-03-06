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
			if ( $scope.order.status === 3 ) {
				fetchEvalMsg($scope.order.ID);
			}
		}
	})
	.error(function() {
		console.log('获取订单信息失败');
	});


	/**
	 *  =distribute
	 *  @about  根据订单的状态，分派不同的跳转方式
	 */
	$scope.distribute = function() {
		if ( $scope.order.status === 1 ) {
			pay();
		}
		else if ( $scope.order.status === 2 ) {
			evalOrder();
		}
	};


	/**
	 *  =pay order
	 *  @about  支付订单
	 */
	 function pay() {
		$http({
			method: 'POST',
			url: '/orderPay',
			data: {
				ID: ID,
				goodID: $scope.order.goodID,
				count: $scope.order.count,
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
	}


	/**
	 *  =evaluate order
	 *  @about  跳转去评论订单
	 */
	function evalOrder() {
		location.href = '/orderEval.html?orderID=' + ID;		
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

		return  year + '-' + month + '-' + day + ' ' + hour + ':' + min;
	}


	/**
	 *  =fetch evaluate message
	 *  @about  获取订单的信息
	 *
	 *  @param  {string}  orderID  订单的ID
	 */
	function fetchEvalMsg(orderID) {
		$http({
			url: 'evalFetch?orderID=' + orderID + '&async=true',
			method: 'GET'
		})
		.success(function(data) {
			$scope.eval = data[0];
			console.log(data);
		})
		.error(function() {
			console.log('获取评论内容失败');
		});
	}
}]);