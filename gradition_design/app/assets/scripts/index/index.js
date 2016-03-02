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

			var el = ele[0];
			console.log(scope);

			el.addEventListener('click', function() {
				console.log('click');
				var s = scope;
			
				// console.log(scope);
				// console.log(ele);
				// console.log(attr);
				// console.log(this);
			}, false);

			// ele.bind('touchstart', function(ev) {
			// 	positionX = ev.touches[0].pageX;
			// 	console.log('start');
			// 	console.log(ev);
			// })
			// .bind('touchmove', function(ev) {
			// 	// var distanceX = ev.touches[0].pageX - positionX;

			// 	// ele.

			// 	console.log(ev.touches[0].pageX);
			// 	console.log('move');
			// })
			// .bind('touchend', function(ev) {
			// 	console.log('end');
			// });
		}
	};
});