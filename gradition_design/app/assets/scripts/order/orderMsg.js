var order = angular.module('orderMsgMD', ['eventMD', 'pageMD', 'urlMD']);

order.controller('orMsgCtrl', ['$scope', '$http', '$location', 'calcUrlParam', 'event', 
function($scope, $http, $location, url, event){
	$scope.order = {};
	$scope.isPending = false;
	$scope.paySuc = false;
	$scope.btnMsg = '立即付款';

	var ID = url.getParamByUrl(window.location.href).orderID;

	$http({
		method: 'GET',
		url: '/orderFetch?ID=' + ID
	})
	.success(function(data) {
		$scope.order = data;
		$scope.order.good.goodCont = data.good.goodType === 1 ? ('代金券(' + data.good.goodCount + '张,价值' + data.sumPrice + '元') : data.good.goodCont;
		$scope.bookTime = parseDate($scope.order.beginTime);
		$scope.order.phone = $scope.order.phone.slice(0, 3) + '****' + $scope.order.phone.slice(7);
	})
	.error(function() {
		console.log('获取订单信息失败');
	});


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