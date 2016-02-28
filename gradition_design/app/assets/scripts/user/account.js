var app = angular.module('app', ['eventMD', 'pageMD']);

app.controller('accountCtrl', ['$scope', 'event', 'history', function($scope, event, history){
	// init
	$scope.title     = '登录账户'; // 页面标题
	$scope.noticTips = '';		   // 提示语的内容
	$scope.isShow = false;         // 提示语是否显示
	$scope.isDisabled = false;     // 是否可以点击提交
	$scope.showLogin = true;       // 展示登录视图，与注册视图展示互斥

	var submitArr = [0, 0, 0],    // 三个输入是否正确性的数组
		tipArr = [                // 提示语内容
			'手机号码不正确或者已经被注册',
			'密码不正确，6-12位、数字，字母，下划线,横杠(-)',
			'两次输入的密码不正确'
		],
		pageTitle = [
			'登录账户',
			'注册账户'
		];

	/**
	 *  =check phone number
	 *  @about    检查手机号是否正确
	 *
	 *  @param    {number}  phoneNum
	 */
	$scope.checkPhoneNum = function(phoneNum) {
		if ( /1\d{10}/.test(phoneNum) || !phoneNum ) { // 简单判断手机号码
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[0] = 1;
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
		if ( /[\w\d_]{6,12}/.test(pwd) ) {
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
		if ( regPwd !== confPwd ) {
			$scope.noticTips = tipArr[2];
			$scope.isShow = true;
			submitArr[2] = 1;
		}
		else {
			$scope.noticTips = '';
			$scope.isShow = false;
		}
	};


	/**
	 *  =check register form
	 *  @about    检查注册的表单提交是否正确
	 *
	 *  @param    {object}  ev  事件处理对象
	 */
	$scope.checkReg = function(ev) {
		var idx = submitArr.indexOf(0);
		if ( idx !== -1 )	{ // 表单没有填写正确
			$scope.isShow = true;
			$scope.noticTips = tipArr[idx];
		}
		else { // 填写正确
			alert('表单填写正确');
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
		if ( !true ) {
			alert('haha');
		}
		else {
			$scope.isShow = true;
			$scope.noticTips = '用户名或者密码不正确';
		}
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