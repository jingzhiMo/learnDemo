var accountMD = angular.module('accountMD', []);

accountMD.controller('accountCtrl', ['$scope', function($scope){
	var tips = '该账号已经比人使用了';

	$scope.noticTips = '';
	$scope.checkPhone = function(phoneNum) {
		if ( /1\d{10}/.test(phoneNum) ) { // 简单判断手机号码
			console.log(true);
			$scope.noticTips = '';
		}
		else {
			$scope.noticTips = '手机号码不正确或者已经被注册';
			console.log(false);
		}
	};
}]);