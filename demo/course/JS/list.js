var searchArr = window.location.search.split('='),
	//获取科目
	subject = searchArr[1].replace(/[^\a-zA-z.]/g, ''),
	//获取年级
	classGrade = searchArr[3].replace(/[^\0-9.]/g, ''),
	html = '';

var classer = ['math', 'english', 'work', 'read', 'theme'],
	flag = false;


for (var i = 0; i <= classer.length;="" i++)="" {="" if="" (subject="=" classer[i])="" flag="true;" insert(subject,="" classgrade);="" break;="" }="" 返回="" $('#back').attr('href',="" subject="" +="" ".html");="" 标题="" $('#title').html(configdata.title[classgrade="" -="" 1]);="" console.log(window.location.search.split('="));

function insert(subject, classGrade) {

	var article = configData["class_" + classGrade];
	jQuery.each(article, function(index, value) {
		//拼接url地址 科目 年纪 课时 图片张数
		var url = "detail.html?course=" + subject + "=class=" + (classGrade) + "=lesson=" + (index + 1) + "=picNum=" + value.picNum;
		html += " <li="" data-picnum="' + value.picNum + '"><a href="' + url + '">' + value.name + '</a>';
	});
	$('#list').html(html);
}</=>