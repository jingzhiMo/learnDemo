angular.module('urlMD', [])
	.service('calcUrlParam', function(){
		return {
			getParamByUrl: function(url) {
			    var result = {},
			        p = /(?:[\?&])([^?=&]+)(?:=?([^?=&]*))/g,
			        match, name, value;
			 
			    while(match = p.exec(url)) {
			        name = match[1];
			        value = match[2] ? decodeURIComponent(match[2]) : undefined;
			        result[name] = value;
			    }
			    return result;
			}
		};
	});