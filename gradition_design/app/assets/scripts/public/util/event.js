angular.module('eventMD', [])
	.service('event', function(){
		return {
			stopProAndPreventDafault: function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			}
		};
	});