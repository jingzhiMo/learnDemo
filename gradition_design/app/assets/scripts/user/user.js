var userApp = angular.module('userApp', ['pageMD', 'eventMD']);

userApp.controller('userCtrl', ['$scope', '$http', '$location', 'event', 
function($scope, $http, $location, event){

	$scope.unpay = 0;
	$scope.paied = 0;
	$scope.finish = 0;
	$scope.over = 0;
	$scope.userMsg = {};

	$scope.isShow = false;

	var submitArr = [0, 0, 0, 0, 0],    // 五个输入是否正确性的数组
		tipArr = [                // 提示语内容
			'手机号码格式不正确',
			'该手机号已经被注册',
			'用户名格式不正确',
			'旧密码不正确',
			'密码不正确，6-12位、数字，字母，下划线,横杠(-)',
			'两次输入的密码不正确',
		];

	fetchUserMsg().then(fetchOrderMsg);

	/**
	 *  =fetch user message
	 *  @about  获取用户信息
	 */
	function fetchUserMsg() {
		var p = new Promise(function(resolve) {
			$http({
				url: '/userFetch?async=true',
				method: 'GET'
			})
			.success(function(data) {
				if ( data.c === 302 ) {
					location.href = 'account.html?sourceUrl=' + location.href;
					return;
				}
				$scope.userMsg = data;
				$scope.userMsg.currPhone = $scope.userMsg.phone;
				resolve(data.ID);
			})
			.error(function() {
				console.log('获取信息失败');
			});
		});

		return p;
	}


	/**
	 *  =fetch order message
	 *  @about  获取订单信息
	 *
	 *  @param  {string}  userID  用户的ID
	 */
	function fetchOrderMsg(userID) {
		$http({
			url: '/orderFetchByUserID?userID=' + userID,
			method: 'GET'
		})
		.success(function(data) {
			if ( data.c === 302 ) {
				location.href = 'account.html?sourceUrl=' + location.href;
				return;
			}
			for( var i = 0, len = data.length; i < len; i++ ) {
				switch( data[i].status ) {
					// 未付款，是默认值
					case 1:
						$scope.unpay++;
					break;

					// 已付款，未评价
					case 2:
						$scope.paied++;
					break;

					// 已付款，已评价
					case 3:
						$scope.finish++;
					break;

					// 已过期
					case 4:
						$scope.over++;
					break;
				}
			}
		})
		.error(function() {
			console.log('获取该用户的订单信息失败');
		});
	}


	/**
	 *  =logout
	 *  @about  退出登录
	 */
	$scope.logout = function() {
		$http({
			url: '/logout',
			method: 'POST'
		})
		.success(function() {
			location.href = '/';
		})
		.error(function() {

		});
	};


	/**
	 *  =switch view
	 *  @about  切换视图，修改用户信息与显示订单信息

	 *  @param  {number}  idx  当前的下标
	 */
	$scope.switchView = function(idx) {
		var bd = document.querySelectorAll('article')[0];

		if ( idx ) {
			bd.className = '';
		}
		else {
			bd.className = 'left';	
		}
	};


	/**
	 *  =check phone num
	 *  @about  检查输入的手机号码是否正确
	 */
	$scope.checkPhoneNum = function() {
		var p = new Promise(function(resolve) {
			if ( /1\d{10}/.test($scope.userMsg.phone) || !$scope.userMsg.phone ) { // 简单判断手机号码
				$scope.noticTips = '';
				$scope.isShow = false;
				submitArr[0] = 1;

				// 查询服务器，该手机号是否被注册
				$http({
					method: 'GET',
					url:    '/checkNewAccount?phone=' + $scope.userMsg.phone,
				})
				.success(function(data) {

					if ( !data.c &&
					     data.ise &&
					     parseInt(data.phone) !== $scope.userMsg.currPhone) { // 该用户已经被注册
						$scope.noticTips = tipArr[1];
						$scope.isShow = true;
						submitArr[0] = 0;
						resolve(false);
					}
					else {
						$scope.noticTips = '';
						$scope.isShow = false;
						submitArr[0] = 1;
						resolve(true);
					}
				})
				.error(function(data, status) {
					// TODO
				});
			}
			else {
				$scope.noticTips = tipArr[0];
				$scope.isShow = true;
				resolve(false);
			}
		});

		return p;
	};


	/**
	 *  =check username
	 *  @about  检查用户名是否正确
	 */
	$scope.checkUsername = function() {
		if ( /'"‘“\//.test($scope.userMsg.username) ) {
			$scope.noticTips = tipArr[2];
			$socpe.isShow = true;
			submitArr[1] = 0;
			return false;
		}
		else {
			submitArr[1] = 1;
			return true;
		}
	};


	/**
	 *  =check old password
	 *  @about  检查旧的密码对不对
	 */
	$scope.checkOldPwd = function() {
		if ( $scope.userMsg.oldPwd !== $scope.userMsg.password ) {
			$scope.noticTips = tipArr[3];
			$scope.isShow = true;
			submitArr[2] = 0;
			return false;
		}
		else {
			submitArr[2] = 1;
			return true;
		}
	};


	/**
	 *  =check new password
	 *  about  检查新输入的密码对不对
	 */
	$scope.checkNewPwd = function() {
		if ( !$scope.userMsg.newPwd ) {
			$scope.noticTips = tipArr[4];
			$scope.isShow = true;
			submitArr[3] = 0;
			return false;
		}
		else if ( /[\w\d_]{6,12}/.test($scope.userMsg.newPwd) ){
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[3] = 1;
			return true;
		}
		else {
			$scope.noticTips = tipArr[4];
			$scope.isShow = true;
			submitArr[3] = 0;
			return false;
		}
	};


	/**
	 *  =confirm password
	 *  @about  确认新密码
	 */
	$scope.confirmPwd = function() {
		if ( !$scope.userMsg.confPwd ) {
			$scope.noticTips = tipArr[5];
			$scope.isShow = true;
			submitArr[4] = 0;
			return false;
		}
		else if ( $scope.userMsg.confPwd === $scope.userMsg.newPwd ) {
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[4] = 1;
			return true;
		}
		else {
			$scope.noticTips = tipArr[5];
			$scope.isShow = true;
			submitArr[4] = 0;
			return false;
		}
	};


	/**
	 *  =submit modify message
	 *  @about  修改用户信息
	 */
	$scope.submit = function() {
		checkAllMsg().then(function(flag) {
			if ( flag ) {
				$http({
					url: '/modifyAccount',
					method: 'POST',
					data: {
						username: $scope.userMsg.username,
						password: $scope.userMsg.confPwd,
						phone: $scope.userMsg.phone
					},
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.success(function() {
					alert('修改用户信息成功');
					location.reload();
				})
				.error(function() {
					alert('修改用户信息失败');
				});
			}
		});
	};


	/**
	 *  =check all input message
	 *  @about  检查所有输入的信息
	 */
	function checkAllMsg() {
		var p = new Promise(function(resolve) {
			$scope.checkPhoneNum().then(function(flag) {
				if ( $scope.checkUsername() &&
				     $scope.checkNewPwd() &&
				     $scope.confirmPwd() ) {

					resolve(true);
				}
				else {
					resolve(false);
				}
			});
		});

		return p;
	}
}]);