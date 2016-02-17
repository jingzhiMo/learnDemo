var accountMD = angular.module('accountMD', []);

accountMD.controller('login', ['$scope', function($scope){
	$scope.click = function() {
		alert('haha');
	}
}]);