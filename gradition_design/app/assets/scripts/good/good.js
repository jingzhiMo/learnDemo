var app = angular.module('app', []);

/**
 *  =all controller
 *  @about 商品页的全局控制器
 */
app.controller('all', ['$scope', '$http', function($scope, $http){
	$scope.pageView = 'add';
	$scope.showTips = false;
	$scope.isSuc = false;
	$scope.isErr = false;
	$scope.tips = "增加";

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
}]);


/**
 *  =add controller
 *  @about  增加商品的控制器
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

			for( var i = 0; i < 3; i++ ) {
				rule.push($scope.rule[i] || '');
				book.push($scope.book[i] || '');
				other.push($scope.other[i] || '');
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
				$scope.$emit('toggleShow', {
					isSuc: true,
					isErr: false,
					tips: '增加商店'
				});
			})
			.error(function(data, status) {
				// TODO
				$scope.$emit('toggleShow', {
					isSuc: false,
					isErr: true,
					tips: '增加商店'
				});
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
		else if ( !( $scope.book[0] || $scope.book[1] || $scope.book[2] ) ) {
			alert('请输入预约提示语');
			return false;
		}
		else if ( !( $scope.rule[0] || $scope.rule[1] || $scope.rule[2] ) ) {
			alert('请输入使用规则');
			return false;
		}
		else if ( !( $scope.other[0] || $scope.other[1] || $scope.other[2] ) ) {
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


/**
 *  =modify controller
 *  @about  修改商品的控制器
 */
app.controller('modify', ['$scope', '$http', 'upload', function($scope, $http, upload){
	$scope.types = [
		{
			msg: 1,
			val: '代金券'
		},
		{
			msg: 2,
			val: '套餐'
		}
	];
	$scope.selectedType = $scope.types[0].msg;
	$scope.hasSelectShop = false;
	$scope.hasSearch = false;
	$scope.good = {
		goodImg: ['/assets/image/loading1.gif', '/assets/image/loading2.gif', '/assets/image/loading3.gif']
	};
	$scope.goodList = [];
	$scope.upload = upload;
	$scope.upload.init('.img-modify-box', $scope.good.goodImg, uploadSuc);
	$scope.uploadFlag = $scope.upload.uploadFlag;

	var reqLock = true;
	/**
	 *  =search good
	 *  @about  根据商店的名字搜索商店
	 */
	$scope.searchGood = function() {
		if ( !reqLock ) { // 上一次请求还没完成
			return;
		}
		$http({
			url: '/goodFetch?goodName=' + $scope.goodName,
			method: 'GET'
		})
		.success(function(data) {
			$scope.goodList = data;
			$scope.hasSearch = true;
			reqLock = true;

			if (data.length === 1) {
				$scope.good = data[0];
				$scope.good.name = data[0].goodName + ''; // 特别处理goodName
				$scope.upload.imgList = $scope.good.goodImg;
			}
		})
		.error(function(err, status) {
			// TODO
			console.log('查询 商品出错; ' + status);
			reqLock = true;
		});
	};

	/**
	 *  =search shop by keyboard
	 *  @about  键盘输入的时候，进行搜索
	 */
	var timer = null;
	$scope.searchGoodByKeyboard = function(){
		clearTimeout(timer);
		timer = setTimeout(function() {
			$scope.searchGood();
		}, 1500);
	};


	/**
	 *  =change select shop
	 *  @about  改变选中的商店
	 */
	$scope.changeGood = function(idx) {
		var goodList = $scope.goodList;

		$scope.hasSelectShop = $scope.goodID ? true : false;

		for( var i = 0, len = goodList.length; i < len; i++ ) {
			if ( $scope.goodID === goodList[i].good.ID ) {
				$scope.good = goodList[i].good;
				$scope.good.name = goodList[i].good.goodName + ''; // 特别处理goodName
				$scope.upload.imgList = $scope.good.goodImg;
				return;
			}
		}
	};


	/**
	 *  =modify good
	 *  @abtou  修改商品信息
	 */
	$scope.modifyGood = function() {

		var rule  = [],
			book  = [],
			other = [];

		if ( checkGoodInput() ) { // 输入正确

			for( var i = 0; i < 3; i++ ) {
				rule.push($scope.good.tips.rule[i] || '');
				book.push($scope.good.tips.book[i] || '');
				other.push($scope.good.tips.other[i] || '');
			}

			$http({
				url: '/goodModify',
				method: 'POST',
				data: {
					ID: $scope.good.ID,
					goodName: $scope.good.name,
					goodDesc: $scope.good.goodDesc,
					goodType: $scope.selectedType || 1,
					goodImg: $scope.good.goodImg,
					goodCont: parseInt($scope.selectedType) === 2 ? $scope.good.goodCont : '',
					tips: {
						startDate: $scope.good.tips.startDate,
						endDate: $scope.good.tips.endDate,
						useTime: {
							openTime: $scope.good.tips.useTime.openTime,
							other: $scope.good.tips.useTime.other
						},
						book: book,
						rule: rule,
						other: other
					},
					oldPrice: $scope.good.oldPrice,
					currPrice: $scope.good.currPrice,
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.success(function(data) {
				// TODO
				$scope.$emit('toggleShow', {
					isSuc: true,
					isErr: false,
					tips: '修改商店'
				});
			})
			.error(function(data, status) {
				// TODO
				$scope.$emit('toggleShow', {
					isSuc: false,
					isErr: true,
					tips: '修改商店'
				});
			});
		}
	};


	/**
 	 *  = check good input
	 */
	function checkGoodInput() {
		if ( !$scope.good.name ) {
			alert('请填写商品的名称');
			return false;
		}
		else if ( !$scope.good.goodDesc ) {
			alert('请填写商品的描述');
			return false;
		}
		else if ( !$scope.good.oldPrice || !$scope.good.currPrice ) {
			alert('请输入商品的价格');
			return false;
		}
		else if ( !$scope.good.tips.startDate || !$scope.good.tips.endDate ) {
			alert('请输入活动时间');
			return false;
		}
		else if ( !$scope.good.tips.useTime.openTime ) {
			alert('请输入营业时间');
			return false;
		}
		else if ( !( $scope.good.tips.book[0] || $scope.good.tips.book[1] || $scope.good.tips.book[2] ) ) {
			alert('请输入预约提示语');
			return false;
		}
		else if ( !( $scope.good.tips.rule[0] || $scope.good.tips.rule[1] || $scope.good.tips.rule[2] ) ) {
			alert('请输入使用规则');
			return false;
		}
		else if ( !( $scope.good.tips.other[0] || $scope.good.tips.other[1] || $scope.good.tips.other[2] ) ) {
			alert('请输入温馨提示');
			return false;
		}
		else {
			$scope.good.goodImg = $scope.good.goodImg || ['', '', ''];
			for ( var i = 0; i < 3; i++) {
				if ( $scope.good.goodImg[i] === '' ) {
					alert('请上传三张图片');
					return false;
				}
			}
		}
		return true;
	}


	/**
	 *  =handle upload option success callback
	 *  @about  处理上传组件成功回调函数
	 */
	function uploadSuc() {
		$scope.good.goodImg = $scope.upload.imgList;
		// 告诉 angular 数据模型发生了改变
		$scope.$apply(function() {
			// TODO
		});
	}
}]);


/**
 *  =delete controller
 *  @about  修改商品的控制器
 */
app.controller('delete', ['$scope', '$http', function($scope, $http){
	$scope.hasSearch = false;
	$scope.goodList = [];
	$scope.isPending = false;

	var reqLock = true;

	/**
	 *  =search good
	 *  @about  根据商店的名字搜索商店
	 */
	$scope.searchGood = function() {
		if ( !reqLock ) { // 上一次请求还没完成
			return;
		}
		$http({
			url: '/goodFetch?goodName=' + $scope.goodName,
			method: 'GET'
		})
		.success(function(data) {
			$scope.goodList = data;
			$scope.hasSearch = true;
			reqLock = true;
			console.log(data);
		})
		.error(function(err, status) {
			// TODO
			console.log('查询 商品出错; ' + status);
			reqLock = true;
		});
	};

	/**
	 *  =delete good
	 *  @about  通过商品的ID删除商品
	 */
	$scope.deleteGood = function(index, ID) {
		if ( confirm('是否删除该商品') ) {
			$scope.isPending = true;
			$http({
				url: '/goodDelete',
				method: 'POST',
				data: {
					goodID: ID
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.success(function(data) {
				$scope.goodList.splice(index, 1);
				$scope.isPending = false;

				$scope.$emit('toggleShow', {
					isSuc: true,
					isErr: false,
					tips: '删除商店'
				});
			})
			.error(function() {
				$scope.isPending = false;
				$scope.$emit('toggleShow', {
					isSuc: false,
					isErr: true,
					tips: '增加商店'
				});
			});
		}
	};


	/**
	 *  =search shop by keyboard
	 *  @about  键盘输入的时候，进行搜索
	 */
	var timer = null;
	$scope.searchGoodByKeyboard = function(){
		clearTimeout(timer);
		timer = setTimeout(function() {
			$scope.searchGood();
		}, 1500);
	};

	/**
	 *  =calc good type
	 *  @about  选择商品的类型
	 *
	 *  @param  {number}  type  商品类型的代号
	 */
	$scope.calcGoodType = function(type) {
		if ( type === 1 ) {
			return '代金券';
		}
		else {
			return '套餐';
		}
	};
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

app.service('upload', ['$http', function($http){

	var uploadFlag = true,
		file       = document.getElementById('file');

	return {
		/**
		 *  =init upload
		 *  @about  上传serview 初始化
		 *
		 *  @param  {string}   clsName  图片的类名
		 *  @param  {array}    imgList  图片的数组
		 *  @param  {function} suc      操作成功的回调函数
		 *  @param  {function} err      操作失败的回调函数
		 */
		init: function(clsName, imgList, suc, err) {
			this.clsName = clsName;
			this.imgList = imgList || this.imgList;
			this.suc = suc;
			this.err = err;
			this.imgBox = document.querySelectorAll(clsName);

			// 动态加入form 表单
			if ( !document.getElementById('imgform') ) {
				var doc  = document,
					div = doc.createElement('div'),
					form = '<form id="imgform" name="testupload" action="/upload/img" target="javascript:;" enctype="multipart/form-data" style="display: none;">' +
								'<input type="file" name="upload" multiple="multiple" id="file">' +
								'<input type="submit" value="Upload" id="submit">' +
							'</form>';

				div.innerHTML = form;
				doc.body.appendChild(div);
			}
		},

		// 图片的数组
		imgList: [],

		// 上传的标记
		uploadFlag: true,

		/**
		 *  =upload img
		 *  @about  上传图片
		 *
		 *  @param  {object}  ev      事件处理对象
		 */
		uploadImg: function(ev) {

			if ( ev.target.disabled ) { // 当前按钮处于禁用状态，直接返回
				return;
			}

			if ( !this.checkImgList(this.imgList) ) { // 图片数量不正确
				return;
			}
			var that = this;

			file = file || document.getElementById('file');

			file.addEventListener('change', function(ev) {
				if ( that.uploadFlag ){ // 判断当前是否可以提交
					that.uploadFlag = false;
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
							that.fillImgBox(JSON.parse(xhr.responseText));
							that.uploadFlag = true;
						}
					};

					xhr.send(formData);
				}
			}, false);

			file.click(); // 触发上传文件按钮
		},

		/**
		 *  =check img list
		 *  @about  检查图片的数量是否正确
		 */
		checkImgList: function(imgList, flag) {

			for(var i = 0; i < 3; i++) {
				if ( imgList[i] === '' ) {
					return true;
				}
			}

			if (i === 3) {
				if ( !flag ) {
					alert('图片数量已满');
				}
				return false;
			}
			return true;
		},
		/**
	 	 *  =fill img box
	 	 *  @about  填充图片
	 	 *
	 	 *  @param  {json}  path  图片在服务器上面的路径
		 */
		fillImgBox: function(path) {
			var doc = document,
				imgBox = this.imgBox || document.querySelectorAll(clsName);

			for(var i = 0; i < 3; i++) {
				if ( this.imgList[i] === '' ) {
					this.imgMaskAdd(i, path.filepath);
					return;
				}
			}
		},
		/**
		 *  =add img mask
		 *  @about  增加图片的遮罩
		 *
		 *  @param  {number}  index  img-box 的下标
		 *  @param  {string}  imgSrc 图片的路径
		 */
		imgMaskAdd: function(index, imgSrc) {
			var doc = document,
				imgBox = this.imgBox || doc.querySelectorAll(clsName),
				fragment = doc.createDocumentFragment(),
				ipt = imgBox[index].innerHTML;

			imgBox[index].innerHTML = '<div class="mask">'+
									  '</div><img src="'+ imgSrc + '">';
			this.imgList[index] = imgSrc;
			this.suc();
		},
		/**
		 *  =delete img mask
		 *  @about  删除图片的遮罩
		 *
		 *  @param  {number}  index  被删除图片的遮罩
		 */
		imgMaskDelete: function(index) {

			if ( this.imgList[index] === '' ) {
				return;
			}

			var doc = document,
				imgBox = this.imgBox.length ? this.imgBox : doc.querySelectorAll(this.clsName);

			this.imgBox = imgBox;
			this.imgBox[index].innerHTML = '';
			this.imgList[index] = '';
		}
	};
}]);