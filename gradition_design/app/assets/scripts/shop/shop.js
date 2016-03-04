var app = angular.module('app', []);

app.controller('all', ['$scope', function($scope){
	$scope.pageView = 'add'; // modify, delete

	$scope.changeView = function(viewName) {
		$scope.pageView = viewName;
	};
}])
.controller('add', ['$scope', function($scope){
	$scope.isChain = false;
	$scope.toggleChain = function() {
		$scope.isChain = !$scope.isChain;
	};
}])
.controller('modify', ['$scope', function($scope){
	
}])
.controller('delete', ['', function($scope){
	
}]);