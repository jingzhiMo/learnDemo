var item = $('.item');
var list = [
	 {
	 	content: item[0],
	 },
	 {
	 	content: item[1],
	 },
	 {
	 	content: item[2],
	 },
	 {
	 	content: item[3],
	 },
	 {
	 	content: item[4],
	 },
	 {
	 	content: item[5],
	 },
	 {
	 	content: item[6],
	 },
	 {
	 	content: item[7],
	 },
	 {
	 	content: item[8],
	 },
	 {
	 	content: item[9],
	 },
	 {
	 	content: item[10],
	 },
	 {
	 	content: item[11],
	 },
	 {
	 	content: item[12],
	 },
	 {
	 	content: item[13],
	 },
	 {
	 	content: item[14],
	 }
];
var myslider = new iSlider({
   	dom: document.getElementById('wrap'),
   	data: list,
   	isOverspread: 1,
   	animateTime: 800,
   	isVertical: true,
   	plugins: ['dot'],
   	fixPage: false // 不阻止事件的触发
});

var isliderDot = $('.islider-dot'),
	$book      = $('.book');

$('body').on('click', function(ev) {
	var $this = $(ev.target),
		ck    = parseInt($this.data('ck')),
		index = parseInt($this.data('index'));


	switch(ck) {
		case 1:
			isliderDot = isliderDot.length > 0 ? isliderDot : $('.islider-dot');
			isliderDot.eq(index).trigger('touchend');
		break;
		case 2:
			isliderDot.eq(isliderDot.length - 1).trigger('touchend');
		break;
	}
}, false);