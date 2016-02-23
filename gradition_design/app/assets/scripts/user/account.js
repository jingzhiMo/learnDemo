var accountMD = angular.module('accountMD', []);

accountMD.controller('accountCtrl', ['$scope', function($scope){
	var tips = '该账号已经比人使用了';
	// var tipShow;

	$scope.noticTips = '';

	// 检测手机号是否正确
	$scope.checkPhone = function(phoneNum) {
		if ( /1\d{10}/.test(phoneNum) || phoneNum === '' ) { // 简单判断手机号码
			$scope.noticTips = '';
			$scope.tipShow = false;
		}
		else {
			$scope.noticTips = '手机号码不正确或者已经被注册';
			$scope.tipShow = true;
			tipShow = true;
		}
	};

	// 检查密码是否正确
	$scope.checkPwd = function(pwd) {
		if ( /[\w\d_]{6,12}/.test(pwd) ) {
			$scope.noticTips = '';
			$scope.tipShow = false;
		}
		else {
			$scope.noticTips = '密码不正确，6-12位、数字，字母，下划线,横杠(-)';
			$scope.tipShow = true;
		}
	};

	// 检查两次密码是否一致
	$scope.confirmPwd = function(reg, conf) {
		if ( reg !== conf ) {
			$scope.noticTips = '两次输入的密码不正确';
			$scope.tipShow = true;
		}
		else {
			$scope.noticTips = '';
			$scope.tipShow = false;
		}
	};
}]);