var orderList = angular.module('orderList', ['eventMD', 'pageMD', 'urlMD']);

orderList.controller('orListCtrl', ['$scope', '$http', 'calcUrlParam', 'event', 
function($scope, $http, url, event){

	$scope.all = [];
	$scope.unpay = [];
	$scope.eval = [];
	$scope.finish = [];
	$scope.over = [];
	$scope.isDelete = false;
	$scope.editWordArr = {
		true: '取消',
		false: '编辑'
	};
	$scope.editing = false;
	$scope.editWord = $scope.editWordArr[$scope.isDelete];
	$scope.deleteArr = [];

	$http({
		url: '/orderFetchByUserID?async=true',
		method: 'GET'
	})
	.success(function(data) {
		if ( data.c === 302 ) {
			location.href = 'account.html?sourceUrl=' + location.href;
			return;
		}
		$scope.all = data;
		for( var i = 0, len = data.length; i < len; i++ ) {
			switch( data[i].status ) {
				// 未付款，是默认值
				case 1:
					$scope.unpay.push(data[i]);
				break;

				// 已付款，未评价
				case 2:
					$scope.eval.push(data[i]);
				break;

				// 已付款，已评价
				case 3:
					$scope.finish.push(data[i]);
				break;

				// 已过期
				case 4:
					$scope.over.push(data[i]);
				break;
			}
		}
	})
	.error(function() {
		console.log('获取该用户的订单信息失败');
	});


	/**
	 *  =pay order
	 *  @about  支付订单
	 *
	 *  @param  {string}  ID  订单的ID
	 *  @param  {number}  idx 下标
	 */
	$scope.pay = function(ID, idx) {
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
				var item = $scope.unpay.splice( idx, 1);
				$scope.eval = $scope.eval.concat(item);
			}
			else {
				alert('支付失败');
			}
			
		})
		.error(function() {

		});
	};


	/**
	 *  =eval order
	 *  @about  评价
	 *
	 *  @param  {string} orderID  订单的ID
	 */
	$scope.evalOrder = function(orderID) {
		location.href = '/orderEval.html?orderID=' + orderID;
	};


	/**
	 *  =edit order
	 *  @about  编辑订单，取消选择
	 */
	$scope.toggleEdit = function(ev) {
		$scope.editing = !$scope.editing;
		$scope.isDelete = !$scope.isDelete;
		$scope.editWord = $scope.editWordArr[$scope.isDelete];
		event.stopProAndPreventDafault(ev);
	};


	/**
	 *  =select checkbox
	 *  @about  选中删除
	 *
	 *  @param  {number}  type  订单类型
	 *  @param  {number}  idx   下标
	 *  @param  {string}  ID    订单的ID
	 *  @param  {object}  ev    事件处理对象
	 */
	$scope.selectCkBox = function(type, idx, ID, ev) {
		if ( ev.target.checked ) {
			$scope.deleteArr.push(ID);
		}
		else {
			var index = $scope.deleteArr.indexOf(ID);

			if ( index !== -1 ){
				$scope.deleteArr.splice(index, 1);
			}
		}		
	};


	/**
	 *  =delete order
	 *  @about  删除订单
	 */
	$scope.deleteOrder = function() {
		if ( $scope.deleteArr.length ) {
			// console.log($scope.deleteArr);
			$http({
				url: '/orderDelete',
				method: 'POST',
				data: {
					idArr: $scope.deleteArr
				},
				headers: {
					'Content-type': 'application/json'
				}
			})
			.success(function(data) {
				if ( data.c === 302 ) {
					location.href = 'account.html?sourceUrl=' + location.href;
					return;
				}
				// 成功
				location.reload();
			})
			.error(function() {
				alert('删除订单失败');
			});
		}
		else {
			alert('请选中订单');
		}
	};
}]);