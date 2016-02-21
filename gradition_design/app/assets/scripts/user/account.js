var accountMD = angular.module('accountMD', []);

accountMD.controller('accountCtrl', ['$scope', function($scope){
	$scope.click = function() {
		alert('haha');
	};
}]);