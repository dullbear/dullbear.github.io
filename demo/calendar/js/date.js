var nowTime = new Date(),
	Year = nowTime.getFullYear(), //获取年份
	Month = nowTime.getMonth() + 1, //获取月份 0-11
	week = nowTime.getDay(), //获取星期 0-6
	date = nowTime.getDate(); //获取日期 1-31
	
var dateShow = $('#dateShow');
$('#upMonth').click(function() {
	Month = parseFloat(Month) - 1;
	if (Month <= 0)="" {="" month="12;" year="" -="1;" }="" form(year,="" month);="" });="" $('#nextmonth').click(function()="" +="" 1;="" if="" (month=""> 12) {
		Month = 1;
		Year += 1;
	}
	form(Year, Month);
});

function form(Year, Month) {
	Month < 10 ? Month = '0' + Month : Month = Month;
	var txt = Year + '-' + Month + '-' + date;
	dateShow.text(txt);
	showTable(Year, Month);
};

var flag = false;

function showTable(year, month) {

	var createDay = new Date(Year, Month, 0),
		days = createDay.getDate(), //获取当月天数

		createDate = new Date(Year, Month - 1, 1),
		firstDate = createDate.getDay(), //获取当前月份1号星期
		html = '<tr>';
	for (var s = 0; s < firstDate; s++) {
		html += '<td class="noBor"></td>';
	}
	for (var i = 0; i < days; i++) {
		if (i > 0 && (i + firstDate) % 7 == 0) {
			html += '</tr><tr>';
		}
		html += '<td><span>' + (i + 1) + '<span></span></span></td>';
	}
	$('#dataTable').html(html);
	$('#dateOl').children('li').eq(week).addClass('current').siblings('li').removeClass('current');
	$('#dataTable').find('td').eq(date + firstDate - 1).addClass('current').siblings('li').removeClass('current');
	$('#dataTable').find('td').eq(date + firstDate - 1).click(function() {		
		if (flag == false) {
			console.log('只有这个能签到啊！');
			flag = true;
		} else {
			alert('今天已签到，明天再来！');
		}
	});
};
form(Year, Month);</tr></=>