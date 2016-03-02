angular.module('eventMD', [])
	.service('event', function(){
		return {

			/**
			 *  =stop propagation and prevent default
			 *  @about    停止事件冒泡和默认行为
			 *
			 *  @param    {object}  ev  事件处理对象
			 */
			stopProAndPreventDafault: function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			},


			/**
			 *  =move
			 *  @about    封装touch move 事件
			 *
			 *  @param    {object}  ele  需要绑定事件的 dom 元素
			 */
			move: function(ele) {
				var startX = 0;
				ele.addEventListener('touchstart', function(ev) {
					startX = ev.touches[0].pageX;
				});
			}
		};
	});

/**
 *  =throttle
 *  @about    函数节流
 *
 *  @param  {function} fn      需要执行的函数
 *  @param  {number}   delay   延迟多少时间执行，毫秒为单位
 *  @param  {number}   mustRun 超过这个时间，一定执行函数，毫秒为单位
 */
function throttle(fn, delay, mustRun) {
	var timer   = null,
		mustRun = mustRun || 100,
		t_start = 0;

	return function() {
		var args = arguments;

		timer && clearTimeout(timer);
		timer = setTimeout(function() {
			var context = this,
				t_curr  = +new Date();

			if( !t_start ) { // 初始化时间戳
				t_start = t_curr;
			}

			if ( t_curr - t_start >= mustRun ) { // 判断是否超过设置必须执行的时间
				fn.apply(context, args);
				t_curr = t_start;
			}
			else {
				fn.apply(context, args);
			}
		}, delay);
	}
}