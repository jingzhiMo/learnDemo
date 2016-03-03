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
			 *  @param    {object}  ele   需要绑定事件的 dom 元素
			 *  @param    {number}  width 每滑动一屏的宽度
			 *  @param    {number}  count 一共有多少屏
			 */
			move: function(ele, width, count) {
				var startX = 0, moveX, distanceX,
					eleStyle = ele.style,
					index = 1,
					currX = 0;

				ele.addEventListener('touchstart', function(ev) {
					startX = ev.touches[0].pageX;
				}, false);

				ele.addEventListener('touchmove', throttle(function(ev) {
						distanceX = ev.touches[0].pageX - startX;
						setStyle(ele, currX + distanceX);
					}, 5, 10), 
				false);

				ele.addEventListener('touchend', function(ev) {
					clearTimeout(timer);
					if ( distanceX < 0 ) { // 向左滑动

						if ( index < count ) {
							currX -= width;
							index++;
						}
						setStyle(ele, currX, 300);
					}
					else { // 向右滑动

						if ( index !== 1 ) {
							currX += width;
							index--;
						}
						setStyle(ele, currX, 300);
					}
					startX = currX;
				}, false);
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
var timer = null;
function throttle(fn, delay, mustRun) {
	// var timer   = null,
	var t_start = 0;

	mustRun = mustRun || 100;
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
	};
}


/**
 *  =set style transform
 *  @about    设置元素向左右滑动的样式
 *
 *  @param    {dom}     ele   需要设置的元素
 *  @param    {number}  wid   左右滑动的大小
 *  @param    {boolean} delay 延迟的时间
 */
function setStyle(ele, wid, delay) {
	delay = delay || 0;
	ele.style.cssText = 'transform: translate3d(' + wid + 'px, 0px, 0px);' +
					    '-webkit-transform: translate3d(' + wid + 'px, 0px, 0px);' +
					    'transition-duration: ' + delay + 'ms;' +
					    '-webkit-transition-duration: ' + delay + 'ms;';
}