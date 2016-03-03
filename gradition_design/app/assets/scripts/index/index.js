var indexApp = angular.module('indexApp', ['pageMD', 'eventMD']);

indexApp.controller('indexCtrl', ['$scope', '$http', 'event', function($scope, $http, event) {

}])
.directive('catalog', ['event', function(event) {

	var positionX = 0;
	return {
		scope: {},
		restrict: 'E',
		repalce: true,
		templateUrl: '/assets/tmpl/catalog.html',
		link: function(scope, ele, attr) {

			var ul = ele.children()[0];
			event.move(ul, ul.offsetWidth / 2, 2);
		}
	};
}]);