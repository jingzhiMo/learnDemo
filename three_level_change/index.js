var first = document.getElementById('first'),
	second = document.getElementById('second'),
    third = document.getElementById('third');

first.addEventListener('change', function(ev) {

	var target = ev.target,
		index = target.selectedIndex,
		tempData = [],
		opt;

	// 根据第一个选中的index,修改第二个select
	tempData = secondData[index];
	while(second.childElementCount) {

		second.remove('option');
	}
	for(var i = 0, len = tempData.length; i < len; i++) {
		// 循环添加数据到第二个select元素当中
		opt = document.createElement('option');
		opt.innerHTML = tempData[i];
		second.appendChild(opt);
	}

	// 把第三个清空
	third.selectedIndex = 0;

},false);

second.addEventListener('change', function(ev) {

	var target = ev.target,
		index = target.selectedOptions[0].innerHTML,
		tempData = [],
		opt;

	// 根据第二个选中的index,修改第三个select
	tempData = thirdData[index];
	while(third.childElementCount) {

		third.remove('option');
	}
	for(var i = 0, len = tempData.length; i < len; i++) {
		// 循环添加数据到第二个select元素当中
		opt = document.createElement('option');
		opt.innerHTML = tempData[i];
		third.appendChild(opt);
	}

}, false);

// 三个select 的数据
var firstData = {
		'0': 0,
		'1': 1,
		'2': 2,
		'3': 3
	},
	secondData = {
		'0': ['--请选择--'],
		'1': ['--请选择--', '11', '12', '13'],
		'2': ['--请选择--', '21', '22', '23'],
		'3': ['--请选择--', '31', '32', '33']
	},
	thirdData = {
		'11': ['--请选择--', '111', '112', '113'],
		'12': ['--请选择--', '121', '122', '123'],
		'13': ['--请选择--', '131', '132', '133'],
		'21': ['--请选择--', '211', '212', '213'],
		'22': ['--请选择--', '221', '222', '223'],
		'23': ['--请选择--', '231', '232', '233'],
		'31': ['--请选择--', '311', '312', '313'],
		'32': ['--请选择--', '321', '322', '323'],
		'33': ['--请选择--', '331', '332', '333']
	};

// 创建和删除
var createBtn = document.getElementById('create');
	delBtn = document.getElementById('del'),
	tbody = document.getElementsByTagName('tbody')[0],
	body = document.getElementsByTagName('body')[0];

// 创建新标签
createBtn.addEventListener('click', function(ev){

	var trEle = document.createElement('tr'),
		tdEle1 = document.createElement('td'),
		tdEle2 = document.createElement('td'),
		inputEle = document.createElement('input'),
		len = document.getElementsByTagName('tr').length;
	inputEle.setAttribute('type','checkbox');
	tdEle2.innerHTML=len + 1;
	tdEle1.appendChild(inputEle);
	trEle.appendChild(tdEle1);
	trEle.appendChild(tdEle2);
	document.getElementsByTagName('table')[0].childNodes[1].appendChild(trEle);
}, false);
// 删除标签
delBtn.addEventListener('click', function(ev){

	var checkbox = document.getElementsByTagName('input'),
		table = document.getElementsByTagName('table')[0],
		tbody = table.childNodes[1],
		tempTr;
	for(var i = 0, len = checkbox.length; i < len; i++) {
		// console.log(i);
		if(checkbox[i].checked) {
			tempTr = checkbox[i].parentNode.parentNode;
			tbody.removeChild(tempTr);
			i--;
			len--;
		}
	}
}, false);

// 双击修改
tbody.addEventListener('dblclick', function(ev) {

	var target  = ev.target,
		parent,
		inputEle,
		val,
		textInput = document.getElementById('text');
	if(target.nodeName === 'TD' && !target.childElementCount) {

		// 如果存在input type=text
		if(textInput) {
			val = textInput.value;
			parent = textInput.parentNode;
			parent.innerHTML = val;
		}

		val = target.innerHTML;
		target.innerHTML = '<input type="text" id="text" value="' + val + '"/>';
		return;
	}
}, false);
// 点击body其他地方
body.addEventListener('click', function(ev) {

	var target = ev.target,
		newVal,
		parent,
		textInput = document.getElementById('text');

	if(textInput && target.getAttribute('id') !== 'text') {

		newVal = textInput.value;
		parent = textInput.parentNode;
		parent.innerHTML = newVal;
	} else {

		return;
	}
}, false);

// 背景图的切换
var color = ['#ccc', '#f60', '#6cf', 'yellow', '#000'],
	box = document.getElementById('switch-img'),
	idx = 0;
window.setInterval(function() {

	box.style.backgroundColor = color[idx++ % 5];
}, 4000);

// 倒计时
var count = 19;
	pEle = document.getElementById('timer');
var timer = window.setInterval(function() {

	if(count <= 0) {

		window.clearInterval(timer);
	}
	pEle.innerHTML = count--;
}, 1000);
