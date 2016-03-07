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
	$scope.uploadFlag = true;
	$scope.imgList = ['', '', ''];
	$scope.alertMsg = '图片数量还不够';

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
					goodImg: $scope.imgList,
					goodCont: parseInt($scope.type) === 2 ? $scope.cont : '',
					tips: {
						startDate: $scope.startDate,
						endDate: $scope.endDate,
						useTime: {
							openTime: $scope.openTime,
							other: $scope.timeTip
						},
						book: book,
						rule: rule,
						other: other
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
	 *  =upload image
	 *  @about  上传图片
	 *
	 *  @param  {object}  ev  事件处理对象
	 */
	$scope.uploadImg = function(ev) {

		if ( ev.target.disabled ) { // 当前按钮处于禁用状态，直接返回
			return;
		}

		if ( !checkImgList() ) { // 图片数量不正确
			alert($scope.alertMsg);
			return;
		}

		var file = document.getElementById('file');

		file.addEventListener('change', function(ev) {
			if ( $scope.uploadFlag ){ // 判断当前是否可以提交
				$scope.uploadFlag = false;
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
						$scope.uploadFlag = true;
					}
				};

				xhr.send(formData);
			}
		}, false);

		file.click(); // 触发上传文件按钮
	};


	/**
 	 *  =fill img box
 	 *  @about  填充图片
 	 *
 	 *  @param  {json}  path  图片在服务器上面的路径
	 */
	function fillImgBox(path) {
		var imgList = $scope.imgList,
			doc = document,
			imgBox = doc.querySelectorAll('.img-box');

		for(var i = 0; i < 3; i++) {
			if ( imgList[i] === '' ) {
				imgMaskAdd(i, path.filepath);
				return;
			}
		}
	}


	/**
	 *  =add img mask
	 *  @about  增加图片的遮罩
	 *
	 *  @param  {number}  index  img-box 的下标
	 *  @param  {string}  imgSrc 图片的路径
	 */
	function imgMaskAdd(index, imgSrc) {
		var doc = document,
			imgBox = doc.querySelectorAll('.img-box'),
			fragment = doc.createDocumentFragment(),
			ipt = imgBox[index].innerHTML;

		imgBox[index].innerHTML = ipt + '<div class="mask">'+
								  '</div><img src="'+ imgSrc + '">';
		$scope.imgList[index] = imgSrc;
	}


	/**
	 *  =delete img mask
	 *  @about  删除图片的遮罩
	 *
	 *  @param  {number}  index  被删除图片的遮罩
	 */
	$scope.imgMaskDelete = function(index) {

		if ( $scope.imgList[index] === '' ) {
			return;
		}

		var doc = document,
			imgBox = doc.querySelectorAll('.img-box');

		imgBox[index].innerHTML = '<input type="text" ng-model="imgList['+ index + ']">';
		$scope.imgList[index] = '';
	};


	/**
	 *  =check img list
	 *  @about  检查图片的数量是否正确
	 */
	function checkImgList() {
		var imgList = $scope.imgList;

		for(var i = 0; i < 3; i++) {
			if ( imgList[i] === '' ) {
				return true;
			}
		}

		if (i === 3) {
			$scope.alertMsg = '图片数量已满';
			return false;
		}
		return true;
	}


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
		else {
			for ( var i = 0; i < 3; i++) {
				if ( $scope.imgList[i] === '' ) {
					alert('请上传三张图片');
					return false;
				}
			}
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