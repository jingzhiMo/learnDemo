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
			 *  @param    {object}  idx   显示下标的元素
			 */
			move: function(ele, width, count, idx) {
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
						// setIndex(idx, index, 'active');
					}
					else { // 向右滑动

						if ( index !== 1 ) {
							currX += width;
							index--;
						}
						setStyle(ele, currX, 300);
						// setIndex(idx, index, 'active');
					}
					setIndex(idx, index, 'active');
					startX = currX;
				}, false);
			},


			/**
			 *  =move Y direction
			 *  @about    封装 touch move 事件，Y方向 滚动
			 *
			 *  @param    {dom}    ele   需要滑动的父元素
			 *  @param    {number} maxY  Y方向的最大滚动高度
			 */
			moveY: function(ele, maxY) {
				var startY = 0,
					currY = 0,
					moveY, endY;

				ele.addEventListener('touchstart', function(ev) {
					startY = ev.touches[0].pageY;
					ev.preventDefault();
				}, false);

				ele.addEventListener('touchmove', function(ev) {
					distanceY = ev.touches[0].pageY - startY;
					currY = currY + distanceY;
					setTransformY(ele, currY);
					ev.preventDefault();
				}, false);

				// ele.addEventListener('touchend', function(ev) {
				// 	clearTimeout(timer);
				// 	if ( distanceY < 0 ) { // 向上滑动

				// 		currY = currY < maxY ? maxY : currY;
				// 		setTransformY(ele, currY);
				// 	}
				// 	else { // 向下滑动

				// 		currY = currY > 0 ? 0 : currY;
				// 		setTransformY(ele, currY);
				// 	}
				// 	// startY = currY;
				// 	ev.preventDefault();
				// }, false);
			},


			/**
			 *  =nav scroll
			 *  @about  滚动的时候，对导航栏进行不同高亮
			 *
			 *  @param  {dom}  nav      导航栏
			 *  @param  {dom}  navItem  导航栏的子元素
			 */
			navScroll: function(nav, navItem) {
				var doc    = document,
					body   = doc.body,
					contTop= '',
					topArr = [],
					panel  = [];

				for( var i = 0 , len = navItem.length; i < len; i++) {
					panel[i] = doc.querySelector(navItem[i].getAttribute('href'));

					(function(i) {
						navItem[i].addEventListener('click', function() {
							topArr[i] = topArr[i] || angular.element(panel[i]).prop('offsetTop');
							window.scrollY = topArr[i] - 40;
						}, false);
					})(i);
				}

				window.addEventListener('scroll', throttle(function() {

					var ele = doc.querySelector('#cont'),
						top = contTop || angular.element(ele).prop('offsetTop') + 40;
						scrollTop = window.scrollY;

					if ( top - 50 < window.scrollY ) {
						nav.style.cssText = 'z-index: 999;position: fixed;top: 0;margin-top: 0;';
						body.style.cssText = 'padding-top: 41px;';
					}
					else {
						nav.style.cssText = '';
						body.style.cssText = 'padding-top: 0';
					}

					var _offsetTop;
					for( var i = 0, len = navItem.length; i < len; i++) {

						if ( !topArr[i] ) {
							topArr[i] = angular.element(panel[i]).prop('offsetTop');
						}
						_offsetTop = topArr[i];

						if ( _offsetTop < window.scrollY + 42) {
							// 去掉 active 类
							var avtiveEle = nav.querySelectorAll('.active')[0];
							avtiveEle.className = avtiveEle.className.replace(/\s?active\s?/g, '');
							navItem[i].className += ' active';
						}

					}

				}, 10, 20), false);

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
	var t_start = 0;

	mustRun = mustRun || 100;
	return function() {
		var args = arguments;

		if ( timer ) {
			clearTimeout(timer);
		}
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


/**
 *  set style transform y
 *  @about    设置元素上下滑动的样式
 *
 *  @param    {dom}    ele  需要设置的元素
 *  @param    {number} h    上下滑动的大小
 */
function setTransformY(ele, h) {
	ele.style.cssText = 'transform: translate3d(0px, ' + h +'px, 0px);' +
					    '-webkit-transform: translate3d(0px, ' + h +'px, 0px);';
}


/**
 *  =set index active
 *  @about  设置下标的高亮
 *
 *  @param  {array}   ele            下标的元素集合
 *  @param  {number}  currIndex      当前的下标
 *  @param  {string}  hightlightCls  高亮的类名
 */
function setIndex(ele, currIndex, hightlightCls) {
	var testPattern = new RegExp(hightlightCls),
		replacePattern = new RegExp("\\s?" + hightlightCls + "\\s?", 'gi');

	for( var i = 0, len = ele.length; i < len; i++) {

		// 存在高亮，但不是当前下标
		if ( testPattern.test(ele[i].className) && ( i + 1 ) !== currIndex ) {
			ele[i].className = ele[i].className.replace(replacePattern, '');
		}
		else if ( i + 1 === currIndex ){
			ele[i].className = ele[i].className + ' ' + hightlightCls;
		}
	}
}