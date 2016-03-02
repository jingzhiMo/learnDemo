var app = angular.module('app', ['eventMD', 'pageMD']);

app.controller('accountCtrl', ['$scope', '$http', 'event', 'history', function($scope, $http, event, history){
	// init
	$scope.title     = '登录账户'; // 页面标题
	$scope.noticTips = '';		   // 提示语的内容
	$scope.isShow = false;         // 提示语是否显示
	$scope.isDisabled = false;     // 是否可以点击提交
	$scope.showLogin = true;       // 展示登录视图，与注册视图展示互斥
	$scope.logDisabled = false;    // 登录按钮是否为 disabeld
	$scope.regDisabled = false;    // 注册按钮是否为 disabeld

	var submitArr = [0, 0, 0],    // 三个输入是否正确性的数组
		tipArr = [                // 提示语内容
			'手机号码格式不正确',
			'密码不正确，6-12位、数字，字母，下划线,横杠(-)',
			'两次输入的密码不正确',
			'该手机号已经被注册'
		],
		pageTitle = [
			'登录账户',
			'注册账户'
		];

	/**
	 *  =check phone number
	 *  @about    检查手机号是否正确
	 *
	 *  @param    {number}  phoneNum   手机号码
	 */
	$scope.checkPhoneNum = function(phoneNum, checkPhone) {
		if ( /1\d{10}/.test(phoneNum) || !phoneNum ) { // 简单判断手机号码
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[0] = 1;

			// 查询服务器，该手机号是否被注册
			$http({
				method: 'GET',
				url:    '/checkNewAccount?phone=' + phoneNum,
			})
			.success(function(data) {

				if ( !data.c && data.ise ) { // 该用户已经被注册
					$scope.noticTips = tipArr[3];
					$scope.isShow = true;
					submitArr[0] = 0;
				}
				else {
					$scope.noticTips = '';
					$scope.isShow = false;
					submitArr[0] = 1;
				}
			})
			.error(function(data, status) {
				// TODO
			});
		}
		else {
			$scope.noticTips = tipArr[0];
			$scope.isShow = true;
		}
	};


	/**
	 *  =check password
	 *  @about    检查输入密码是否正确
	 *
	 *  @param    {string}  pwd
	*/
	$scope.checkPwd = function(pwd) {
		if ( !pwd ) {
			$scope.noticTips = tipArr[1];
			$scope.isShow = true;
		}
		else if ( /[\w\d_]{6,12}/.test(pwd) ){
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[1] = 1;
		}
		else {
			$scope.noticTips = tipArr[1];
			$scope.isShow = true;
		}
	};


	/**
	 *  =confirm password
	 *  @about    确认两次输入的密码是否一致
	 *
	 *  @param    {string}  regPwd  注册的密码
	 *  @param    {string}  confPwd 确认密码
	*/
	$scope.confirmPwd = function(regPwd, confPwd) {
		if ( !regPwd ) {
			$scope.noticTips = tipArr[2];
			$scope.isShow = true;
		}
		else if ( regPwd === confPwd ) {
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[2] = 1;
		}
		else {
			$scope.noticTips = tipArr[2];
			$scope.isShow = true;
		}
	};


	/**
	 *  =check register form
	 *  @about    检查注册的表单提交是否正确
	 *
	 *  @param    {object}  ev  事件处理对象
	 */
	$scope.checkReg = function(ev) {

		// 再次检查一遍确认密码
		$scope.confirmPwd($scope.regPwd, $scope.confPwd);

		var idx = submitArr.indexOf(0);
		if ( idx !== -1 )	{ // 表单没有填写正确
			$scope.isShow = true;
			$scope.noticTips = tipArr[idx];
		}
		else { // 填写正确，请求注册

			// 设置按钮不可再点
			$scope.regDisabled = true;

			$http({
				method: 'POST',
				url:    '/register',
				data: {
					phone: $scope.regPhone,
					password: $scope.regPwd,
					username: $scope.regPhone + 'p'
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.success(function(data) {
				if ( !data.c && data.ise ) { // 该用户已经被注册
					$scope.noticTips = tipArr[3];
					$scope.isShow = true;
					submitArr[0] = 1;
				}
				else if ( !data.c ){ // 注册成功
					// TODO
					alert('注册成功');
				}
				// 设置按钮可点击
				$scope.regDisabled = false;
			})
			.error(function(data, status) {
				// TODO
				// 设置按钮可点击
				$scope.regDisabled = false;
			});
		}
		event.stopProAndPreventDafault(ev);
	};


	/**
	 *  =check login form
	 *  @about    检查输入账号密码是否正确
	 *
	 *  @param    {number}  phone  手机号码
	 *  @param    {string}  pwd    密码
	 *  @param    {object}  ev     事件处理对象
	*/
	$scope.checkLogin = function(phone, num, ev) {
		$scope.logDisabled = true;
		$http({
			method: 'GET',
			url:    '/login?phone=' + $scope.logPhone + '&password=' + $scope.logPwd,
		})
		.success(function(data) {
			if ( !data.c ) {
				// TODO
				alert('登录成功');
				$scope.logDisabled = false;
				return;
			}
			$scope.isShow = true;
			$scope.noticTips = '用户名或者密码不正确';
			$scope.logDisabled = false;
		})
		.error(function(data, status) {
			console.log(status);
			alert('服务器出了一点问题，请稍后再试试');
			$scope.logDisabled = false;
			return;
		});
		event.stopProAndPreventDafault(ev);
	};


	/**
	 *  =switch view
	 *  @about    登录与注册视图之间的切换
	 *
	 *  @param    {object}  ev  事件处理对象
	 */
	$scope.switchView = function(ev) {
		$scope.showLogin = !$scope.showLogin;
		$scope.isShow = false;
		$scope.title = pageTitle[$scope.showLogin ? 0 : 1];
		event.stopProAndPreventDafault(ev);
	};
}]);