var app = angular.module('app', []);

/**
 *  =all controller
 *  @about 商品页的全局控制器
 */
app.controller('all', ['$scope', '$http', function($scope, $http){
	$scope.pageView = 'add';
}]);


/**
 *  =add controller
 *  @about 增加商品的控制器
 */
app.controller('add', ['$scope', '$http', 'fetch', function($scope, $http, fetch){

	$scope.shopList = []; // 商店列表
	$scope.isAddDisabled = false;

	// 获取商店列表
	fetch.fetchShop('/shopFetch', function(data) {

		$scope.shopList = data;

	}, function(status) {
		// TODO
		console.log('fetch shop error; status is' + status);
	});


	$scope.addGood = function() {
		var rule  = [],
			book  = [],
			other = [];

		if ( checkGoodInput() ) { // 输入正确

			book = [$scope.book1];
			if ( $scope.book2 ) {
				book.push($scope.book2);
			}
			if ( $scope.book3 ) {
				book.push($scope.book3);
			}

			rule = [$scope.rule1];
			if ( $scope.rule2 ) {
				rule.push($scope.rule2);
			}
			if ( $scope.rule3 ) {
				rule.push($scope.rule3);
			}

			other = [$scope.other1];
			if ( $scope.other2 ) {
				other.push($scope.other2);
			}
			if ( $scope.other3 ) {
				other.push($scope.other3);
			}

			$http({
				url: '/goodAdd',
				method: 'POST',
				data: {
					goodName: $scope.name,
					goodDesc: $scope.desc,
					goodType: $scope.type || 1,
					goodImg: [], // TODO
					tips: {
						startDate: $scope.startDate,
						endDate: $scope.endDate,
						useTime: {
							openTime: $scope.openTime,
							other: $scope.timeTip
						},
						book: book,
						rule: rule
					},
					oldPrice: $scope.oldPrice,
					currPrice: $scope.currPrice,
					shopID: $scope.shopID
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.success(function(data) {
				// TODO
				alert('添加成功');
			})
			.error(function(data, status) {
				// TODO
				alert('添加失败');
			});
		}
	};


	/**
 	 *  = check good input
	 */
	function checkGoodInput() {
		if ( !$scope.name ) {
			alert('请填写商品的名称');
			return false;
		}
		else if ( !$scope.desc ) {
			alert('请填写商品的描述');
			return false;
		}
		else if ( !$scope.oldPrice || !$scope.currPrice ) {
			alert('请输入商品的价格');
			return false;
		}
		else if ( !$scope.shopID || $scope.shopID === 'default' ) {
			alert('请选择商家');
			return false;
		}
		else if ( !$scope.startDate || !$scope.endDate ) {
			alert('请输入活动时间');
			return false;
		}
		else if ( !$scope.openTime ) {
			alert('请输入营业时间');
			return false;
		}
		else if ( !$scope.book1 ) {
			alert('请输入预约提示语');
			return false;
		}
		else if ( !$scope.rule1 ) {
			alert('请输入使用规则');
			return false;
		}
		else if ( !$scope.other1 ) {
			alert('请输入温馨提示');
			return false;
		}
		return true;
	}
}]);


app.service('fetch', ['$http', function($http){
	return {
		/**
		 *  =fetch shop
		 *  @about  从远端获取商品
		 *
		 *  @param  {string}   url  请求的地址
		 *  @param  {function} suc  请求成功的回调函数
		 *  @param  {function} err  请求失败的回调函数
		 */
		fetchShop: function(url, suc, err) {
			$http({
				method: 'GET',
				url: url
			})
			.success(function(data) {
				suc(data);
			})
			.error(function(data, status) {
				if ( err ) {
					err(status);
				}
			});
		}
	};
}]);