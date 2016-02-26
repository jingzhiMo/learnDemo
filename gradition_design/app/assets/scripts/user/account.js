var app = angular.module('app', []);

app.controller('accountCtrl', ['$scope', function($scope){
	// init
	$scope.noticTips = '';		  // 提示语的内容
	$scope.isShow = false;        // 提示语是否显示
	$scope.isDisabled = false;    // 是否可以点击提交

	var submitArr = [0, 0, 0];    // 三个输入是否正确性的数组
		tipArr = [                // 提示语内容
			'手机号码不正确或者已经被注册',
			'密码不正确，6-12位、数字，字母，下划线,横杠(-)',
			'两次输入的密码不正确'
		];

	// 检测手机号是否正确
	$scope.checkPhone = function(phoneNum) {
		if ( /1\d{10}/.test(phoneNum) || phoneNum === '' ) { // 简单判断手机号码
			$scope.noticTips = '';
			$scope.isShow = false;
			submitArr[0] = 1;
		}
		else {
			$scope.noticTips = tipArr[0];
			$scope.isShow = true;
		}
	};

	// 检查密码是否正确
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

	// 检查两次密码是否一致
	$scope.confirmPwd = function(reg, conf) {
		if ( reg !== conf ) {
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
		ev.preventDefault();
		ev.stopPropagation();
	};
}]);