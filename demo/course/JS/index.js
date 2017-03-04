var mathName = course.math.name,
	html = '';

var a = 'math';

jQuery.each(mathName, function(i, el) {
	//拼接url地址 科目 课时
	var url = "list.html?course=" + a + "=class=" + (i + 1);
	html += '<li><a href="' + url + '">' + el + '</a></li>';
});

$('#Math').html(html);