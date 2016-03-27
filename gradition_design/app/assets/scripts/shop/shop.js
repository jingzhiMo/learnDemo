var app = angular.module('app', ['adminMD']);

app.controller('all', ['$scope', '$location', '$http', 'checkAdmin',
function($scope, $location, $http, checkAdmin){
	$scope.pageView = 'add'; // modify, delete
	$scope.showTips = false;
	$scope.isSuc = false;
	$scope.isErr = false;
	$scope.tips = "增加";

	checkAdmin(); // 检查是否是管理员
	

	$scope.changeView = function(viewName) {
		$scope.pageView = viewName;
		$scope.showTips = false;
	};

	/**
	 *  =toggle show tips
	 *  @about  绑定切换显示操作是否完成
	*/
	$scope.$on('toggleShow', function(event, msg) {
		$scope.showTips = true;
		$scope.isSuc = msg.isSuc;
		$scope.isErr = msg.isErr;
		$scope.tips = msg.tips;
		$scope.pageView = 'none';
	});

	/**
	 *  =reload
	 *  @about  刷新页面
	 */
	$scope.reload = function() {
		window.location.reload();
	};
}])
.controller('add', ['$scope', '$http', function($scope, $http){

	$scope.isChain = false;
	$scope.uploadFlag = true;
	$scope.imgList = ['', '', ''];
	$scope.alertMsg = '图片数量还不够';
	$scope.shopList = [];


	/**
	 *  =fetch all shop
	 *  @about  获取所有店铺
	 */
	$http({
		url: '/shopFetch',
		method: 'GET'
	})
	.success(function(data) {
		$scope.shopList = data;
	})
	.error(function(data, status) {
		// TODO
		console.log('获取所有商店失败');
	});

	/**
	 *  =toggle shop is chain
	 *  @about  切换显示是否是连锁店
	 */
	$scope.toggleChain = function() {
		$scope.isChain = !$scope.isChain;
	};


	/**
	 *  = add shop
	 *  @about  增加商店
	 */
	$scope.addShop = function(ev) {

		if ( checkShopMsg() ) { // 检查输入是否正确
			 // TODO
			$http({
			 	url: '/shopAdd',
			 	method: 'POST',
			 	headers: {
			 		'Content-Type': 'application/json'
			 	},
			 	data: {
			 		name: $scope.name,
			 		place: $scope.place,
			 		phone: $scope.phone,
			 		isChain: $scope.isChain,
			 		chainShop: $scope.chainShop || 'new',
			 		shopImg: $scope.imgList,
			 		goodRecom: $scope.recom
			 	}
			})
			.success(function(data) {
				// TODO
				$scope.$emit('toggleShow', {
					isSuc: true,
					isErr: false,
					tips: '增加商家'
				});
				ev.stopPropagation();
				ev.preventDefault();
			})
			.error(function() {
				// TODO
				$scope.$emit('toggleShow', {
					isSuc: false,
					isErr: true,
					tips: '增加商家'
				});
				ev.stopPropagation();
				ev.preventDefault();

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
	 *  =check shop message
	 *  @about  检查输入的商家信息
	 *
	 *  @return  {boolean}    输入是否正确
	 */
	function checkShopMsg() {
		if ( !$scope.name ) {
			alert('请填写商家名称');
			return false;
		}
		else if ( !$scope.place ) {
			alert('请填写商家地址');
			return false;
		}
		else if ( !$scope.phone ) {
			alert('请填写商家的预留电话');
			return false;
		}
		else if ( !$scope.recom ) {
			alert('请填写商家推荐菜式');
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
}])
.controller('modify', ['$scope', '$http', function($scope, $http){
	$scope.hasSearch = false;
	$scope.shopName = '';
	$scope.hasSelectShop = false;
	$scope.imgList = [];
	$scope.uploadFlag = true;
	$scope.alertMsg = '图片数量不正确';
	$scope.isPending = false;

	var reqLock = true;

	/**
	 *  =search shop
	 *  @about  根据商店的名字搜索商店
	 */
	$scope.searchShop = function() {
		if ( !reqLock ) { // 上一次请求还没完成
			return;
		}
		$http({
			url: '/shopFetch?shopName=' + $scope.shopName,
			method: 'GET'
		})
		.success(function(data) {
			$scope.shopList = data;
			$scope.hasSearch = true;
			reqLock = true;

			if (data.length === 1) {
				$scope.shop = data[0];
				$scope.shop.name = data[0].shopName + ''; // 特别处理shopName
				$scope.imgList = data[0].shopImg;
				setImgSrc(document.querySelectorAll('.modifyImg'), data[0].shopImg);
			}
		})
		.error(function(err, status) {
			// TODO
			console.log('查询 商店出错; ' + status);
			reqLock = true;
		});
	};


	/**
	 *  =search shop by keyboard
	 *  @about  键盘输入的时候，进行搜索
	 */
	var timer = null;
	$scope.searchShopByKeyboard = function(){
		clearTimeout(timer);
		timer = setTimeout(function() {
			$scope.searchShop();
		}, 1000);
	};


	/**
	 *  =change select shop
	 *  @about  改变选中的商店
	 */
	$scope.changeShop = function() {
		var shopList = $scope.shopList,
			img      = document.querySelectorAll('.modifyImg');

		$scope.hasSelectShop = $scope.shopID ? true : false;

		for( var i = 0, len = shopList.length; i < len; i++ ) {
			if ( $scope.shopID === shopList[i].shopID ) {
				$scope.shop = shopList[i];
				$scope.shop.shopName = shopList[i].shopName + ''; // 特别处理shopName
				setImgSrc(img, shopList[i].shopImg);
				return;
			}
		}
	};


	/**
	 *  =modify shop message
	 *  @about  修改商店的信息
	 *
	 *  @param  {object}  ev  事件处理对象
	 */
	$scope.modifyShop = function(ev) {
		if ( checkShopMsg() ) { // 检查输入是否正确
			 
			$scope.isPending = true;
			$http({
			 	url: '/shopModify',
			 	method: 'POST',
			 	headers: {
			 		'Content-Type': 'application/json'
			 	},
			 	data: {
			 		ID: $scope.shop.ID,
			 		name: $scope.shop.name,
			 		place: $scope.shop.shopPlace,
			 		phone: $scope.shop.shopPhone,
			 		shopImg: $scope.imgList
			 	}
			})
			.success(function(data) {
				// TODO
				$scope.isPending = false;
				$scope.$emit('toggleShow', {
					isSuc: true,
					isErr: false,
					tips: '修改商家'
				});
				ev.stopPropagation();
				ev.preventDefault();
			})
			.error(function() {
				// TODO
				$scope.isPending = false;
				$scope.$emit('toggleShow', {
					isSuc: false,
					isErr: true,
					tips: '修改商家'
				});
				ev.stopPropagation();
				ev.preventDefault();
			});
		}
	};


	/**
	 *  =set img src
	 *  @about  设置图片的路径
	 */
	function setImgSrc(img, src) {
		for(var i = 0, len = img.length; i < len; i++) {
			img[i].src = src[i];
		}
	}


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

		var file = document.getElementById('file-modify');

		file.addEventListener('change', function(ev) {
			if ( $scope.uploadFlag ){ // 判断当前是否可以提交
				$scope.uploadFlag = false;
			}
			else {
				console.log('重复提交');
				return;
			}
			if ( ev.target.files.length ) {
				var formData = new FormData(document.getElementById('img-form-modify')),
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
			imgBox = doc.querySelectorAll('.img-modify-box');

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
			imgBox = doc.querySelectorAll('.img-modify-box'),
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
			imgBox = doc.querySelectorAll('.img-modify-box');

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
	 *  =check shop message
	 *  @about  检查输入的商家信息
	 *
	 *  @return  {boolean}    输入是否正确
	 */
	function checkShopMsg() {
		if ( !$scope.shop.shopName ) {
			alert('请填写商家名称');
			return false;
		}
		else if ( !$scope.shop.shopPlace ) {
			alert('请填写商家地址');
			return false;
		}
		else if ( !$scope.shop.shopPhone ) {
			alert('请填写商家的预留电话');
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
}])
.controller('delete', ['$scope', '$http', function($scope, $http){
	$scope.shopName = '';
	$scope.hasSearch = false;
	$scope.isPending = false;

	var reqLock = true;

	/**
	 *  =search shop
	 *  @about  根据商店的名字搜索商店
	 */
	$scope.searchShop = function() {
		if ( !reqLock ) { // 上一次请求还没完成
			return;
		}
		$http({
			url: '/shopFetch?shopName=' + $scope.shopName,
			method: 'GET'
		})
		.success(function(data) {
			$scope.shopList = data;
			$scope.hasSearch = true;
			reqLock = true;
		})
		.error(function(err, status) {
			// TODO
			console.log('查询 商店出错; ' + status);
			reqLock = true;
		});
	};


	/**
	 *  =delete shop
	 *  @about  删除商家
	 *
	 *  @param  {number}  index  列表的下标
	 *  @param  {string}  ID     商家的ID
	 */
	$scope.deleteShop = function(index, ID) {
		if ( confirm('删除该商家，会将该商家下的所有商品都删除，是否删除？') ) {
			$scope.isPending = true;
			$http({
				method: 'POST',
				url: '/shopDelete',
				data: {
					shopID: ID
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.success(function() {
				// TODO
				$scope.isPending = false;
				$scope.shopList.splice(index, 1);
				$scope.$emit('toggleShow', {
					isSuc: true,
					isErr: false,
					tips: '删除商家'
				});
			})
			.error(function(data, status) {
				// TODO
				$scope.isPending = false;
				$scope.$emit('toggleShow', {
					isSuc: false,
					isErr: true,
					tips: '删除商家'
				});
			});
		}
	};


	/**
	 *  =search shop by keyboard
	 *  @about  键盘输入的时候，进行搜索
	 */
	var timer = null;
	$scope.searchShopByKeyboard = function(){
		clearTimeout(timer);
		timer = setTimeout(function() {
			$scope.searchShop();
		}, 1000);
	};
}]);