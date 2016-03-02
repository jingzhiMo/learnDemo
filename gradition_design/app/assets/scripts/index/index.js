var indexApp = angular.module('indexApp', ['pageMD']);

indexApp.controller('indexCtrl', ['$scope', '$http', function($scope, $http) {

}])
.directive('catalog', function() {

	var positionX = 0;
	return {
		scope: {},
		restrict: 'E',
		repalce: true,
		templateUrl: '/assets/tmpl/catalog.html',
		link: function(scope, ele, attr) {

			// ele.children()[0].addEventListener('touchstart', function() {
			// 	// console.log(ele);
			// 	// console.log(scope);
			// 	console.log('haha');
			// }, false);

			ele.bind('touchstart', function(ev) {
				positionX = ev.touches[0].pageX;
				console.log(ele);
				console.log(attr);
				console.log('start');
				console.log(ev);
			})
			.bind('touchmove', function(ev) {
				// var distanceX = ev.touches[0].pageX - positionX;

				// ele.

				console.log(ev.touches[0].pageX);
				console.log('move');
			})
			.bind('touchend', function(ev) {
				console.log('end');
			});
		}
	};
});