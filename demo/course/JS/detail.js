var searchArr = window.location.search.split('='),
	//获取科目
	subject = searchArr[1].replace(/[^\a-zA-z.]/g, ''),
	//获取年级
	classer = searchArr[3].replace(/[^\0-9.]/g, ''),
	//获取课时
	lesson = searchArr[5].replace(/[^\0-9.]/g, ''),
	//获取图片张数
	picNum = searchArr[7].replace(/[^\0-9.]/g, ''),
	html = '';

	

function insert() {
	for (var i = 1; i <= picNum; i++) {
		//拼接图片url地址 科目 年级 课时 图片
		var url = subject + "/class_" + classer + "/lesson_" + lesson + "/pic_" + i + ".png";
		html += '<img src="' + url + '" />'
	}
	$('#detail').html(html);
}

insert();

$('#back').click(function(){
	window.history.back();
});