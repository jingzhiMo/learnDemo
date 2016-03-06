var app = angular.module('app', []);

app.controller('all', ['$scope', function($scope){
	$scope.pageView = 'add'; // modify, delete

	$scope.changeView = function(viewName) {
		$scope.pageView = viewName;
	};
}])
.controller('add', ['$scope', '$http', function($scope, $http){

	$scope.isChain = false;
	$scope.uploadFlag = true;
	$scope.imgList = ['', '', ''];
	$scope.alertMsg = '图片数量还不够';


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
			 		shopImg: $scope.imgList
			 	}
			})
			.success(function(data) {
				// TODO
				alert('success');
				ev.stopPropagation();
				ev.preventDefault();
			})
			.error(function() {
				// TODO
				alert('add shop error');
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
.controller('modify', ['$scope', function($scope){
	
}])
.controller('delete', ['', function($scope){
	
}]);