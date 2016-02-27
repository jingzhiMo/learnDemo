var GP = GP || {};

;(function(GP) {
	var util = GP.util || {};

	/**
	 *  =stop propagation and prevent default
	 *  @about    阻止默认事件和阻止事件冒泡
	 *
	 *  @param    ev  {object}  事件处理对象
	*/
	util.stopProAndPreventDafault = function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
	};

	GP.util = util;
}(GP));