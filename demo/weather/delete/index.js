"use strict";

var lunar = calendar.solar2lunar();

$('#data').html(lunar.cYear + '年' + lunar.cMonth + '月' + lunar.cDay + '日 ' + lunar.ncWeek + ' 农历：' + lunar.IMonthCn + lunar.IDayCn);

$('#video_play').click(function () {
    $('#video')[0].play();
});

$('#otherSite').tap(function () {
    $('#search_pup').removeClass('hide');
});

$('#back').tap(function () {
    $('#search_pup').addClass('hide');
});

var myScroll, wrapScroll;

function loaded() {
    myScroll = new IScroll('#wrapper', { scrollX: true, scrollY: true, mouseWheel: false, eventPassthrough: true });

    wrapScroll = new IScroll('#wrap', { scrollX: true, scrollY: true, mouseWheel: false, eventPassthrough: true });
}

loaded();