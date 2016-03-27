angular.module('adminMD', [])
.service('checkAdmin', ['$http', function($http){
	return function(fn) {
		// 检查是否是管理员，不是则跳转到首页
		$http({
			url: '/adminTest',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.success(function(data) {
			if ( fn ) {
				fn(data);
				return;
			}
			if ( data.c !== 0 ) { // 默认是跳转
				location.href = '/';
			}
		})
		.error(function() {
			console.log('检查失败');
		});
	};
}]);