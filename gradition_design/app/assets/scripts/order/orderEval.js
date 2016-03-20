var orderEval = angular.module('orderEval', ['eventMD', 'pageMD', 'urlMD']);

orderEval.controller('orEvalCtrl', ['$scope', '$http', 'calcUrlParam', 'event', 
function($scope, $http, url, event){

	var uploadFlag = true,
		orderID    = url.getParamByUrl(location.href).orderID;

	if ( !orderID ) {
		location.href = '/';
	}

	$scope.sumScore = 0;
	$scope.sumWidth = '0%';
	$scope.eatScore = 0;
	$scope.eatWidth = '0%';
	$scope.envirScore = 0;
	$scope.envirWidth = '0%';
	$scope.serviceScore = 0;
	$scope.serviceWidth = '0%';

	$scope.imgSrc = [];
	$scope.isPending = false;


	$http({
		url: '/orderFetch?ID=' + orderID + '&async=true',
		method: 'GET'
	})
	.success(function(data) {
		if ( data.c === 302 ) {
			location.href = '/account.html?sourceUrl=' + location.href;
		}
		$scope.order = data;
		$scope.order.bookTime = parseDate(data.beginTime);
		console.log($scope.order);
	})
	.error(function() {
		console.log('获取订单信息失败');
	});


	/**
	 *  =evaluate score
	 *  @about  评分
	 *
	 *  @param  {number}  type  评价的类型
	 *  @param  {number}  score 评分的多少
	 */
	$scope.evalScore = function(type, score) {
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
		switch(type) {
			// 总评
			case 0:
				$scope.sumScore = score;
				$scope.sumWidth = width;
			break;
			// 口味
			case 1:
				$scope.eatScore = score;
				$scope.eatWidth = width;
			break;
			// 环境
			case 2:
				$scope.envirScore = score;
				$scope.envirWidth = width;
			break;
			// 服务
			case 3:
				$scope.serviceScore = score;
				$scope.serviceWidth = width;
			break;
		}
	};


	/**
	 *  =upload img
	 *  @about  上传图片
	 */
	$scope.uploadImg = function() {
		var file = document.getElementById('file');

		file.addEventListener('change', function(ev) {
			if ( uploadFlag ){ // 判断当前是否可以提交
				uploadFlag = false;
			}
			else {
				console.log('重复提交');
				return;
			}
			if ( ev.target.files.length ) {
				var formData = new FormData(document.getElementById('imgform')),
					xhr      = new XMLHttpRequest();

				xhr.open('POST', '/upload/img', true);

				xhr.onreadystatechange = function(data) {
					if ( xhr.readyState === 4 && xhr.status === 200 ) {	
						fillImgBox(JSON.parse(xhr.responseText));
						uploadFlag = true;
					}
				};

				xhr.send(formData);
			}
		}, false);

		file.click(); // 触发上传文件按钮
	};


	/**
	 *  =delete img
	 *  @about  删除图片
	 *
	 *  @param  {number}  idx
	 */
	$scope.deleteImg = function(idx) {
		$scope.imgSrc.splice(idx, 1);
	};


	/**
	 *  =fill img box
	 *  @about  上传文件成功，填充图片box
	 *
	 *  @param  {string}  path  图片的路径
	 */
	function fillImgBox(path) {
		$scope.imgSrc.push(path.filepath);

		// 更新 $scope 的数据
		$scope.$apply(function() {

		});
	}


	/**
	 *  submit evaluate
	 *  @about  提交评价
	 */
	$scope.submitEval = function() {
		if ( checkEval() ) {
			var word = document.getElementById('evalCont').innerHTML;
			var order = $scope.order;
			// var data = {
			// 	goodID: order.goodID,
			// 	shopID: order.shopID,
			// 	orderID: order.ID,
			// 	cont: {
			// 		points: {
			// 			eat: $scope.eatScore,
			// 			envir: $scope.envirScore,
			// 			service: $scope.serviceScore,
			// 			sum: $scope.sumScore
			// 		},
			// 		imgList: $scope.imgSrc,
			// 		word: word
			// 	}
			// };
			$http({
				url: '/evalAdd',
				method: 'POST',
				data: {
					goodID: order.goodID,
					shopID: order.shopID,
					orderID: order.ID,
					cont: {
						points: {
							eat: $scope.eatScore,
							envir: $scope.envirScore,
							service: $scope.serviceScore,
							sum: $scope.sumScore
						},
						imgList: $scope.imgSrc,
						word: word
					}
				},
				headers: {
					'Content-type': 'application/json'
				}
			})
			.success(function(data) {
				if ( data.c === 302 ) {
					location.href = '/account.html?sourceUrl=' + location.href;
					return;
				}
				location.href = '/orderMsg.html?orderID=' + $scope.order.ID;
			})
			.error(function() {
				alert('评论失败');
			});
		}
		else {
		}
	};


	/**
	 *  =check evaluate
	 *  @about  检查输入的评价
	 */
	function checkEval() {
		if ( !$scope.sumScore ) {
			alert('对总体评价一下呗');
			return false;
		}
		else if ( !$scope.eatScore ) {
			alert('对口味评价一下呗');
			return false;
		}
		else if ( !$scope.envirScore ) {
			alert('对环境评价一下呗');
			return false;
		}
		else if ( !$scope.serviceScore ) {
			alert('对服务评价一下呗');
			return false;
		}
		else if ( !document.getElementById('evalCont').innerHTML ) {
			alert('输入一下评论呗');
			return false;
		}
		return true;
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
}]);