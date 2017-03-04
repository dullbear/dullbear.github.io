$('#funImgBtn').tap(function() {
	//预览
	var $funImg = $('#funImg');
	if ($funImg.hasClass('hide')) {
		$funImg.removeClass('hide');
	} else {
		$funImg.addClass('hide');
	}
});

//是否为微信、qq内置
var ua = navigator.userAgent.toLowerCase();



$('#survey').tap(function() {
	//调查
	$('.pupBox1,.pupBox1 .survey').removeClass('hide');
});

$('.shareTheme').tap(function() {
	//分享
	if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ/i) == "_sq") {
		$('.pupBox,.pupBox .wxTip').removeClass('hide');
	} else {
		$('.pupBox1,.pupBox1 .shareBox').removeClass('hide');
	}
});

$('.shareDown').tap(function() {
	//下载
	if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ/i) == "_sq") {
		$('.pupBox,.pupBox .downTip').removeClass('hide');
	} else {
		$('.pupBox2,.pupBox2 .shareBox').removeClass('hide');
	}
});

$('.pupBox').tap(function() {
	$('.pupBox,.pupBox .downTip,.pupBox .wxTip').addClass('hide');
});

$('.shareClose').tap(function() {
	//分享
	$('.pup,.pup .shareBox,.pupBox1,.pupBox1 .shareBox,.pupBox1,.pupBox1 .survey').addClass('hide');
});

$('.pup').tap(function() {
	$(this).addClass('hide');
	$('.pup,.pup .shareBox,.pupBox1,.pupBox1 .shareBox,.pupBox1,.pupBox1 .survey').addClass('hide');
});

$('.pup .shareBox,.pup .survey').tap(function() {
	return false;
});



// $('.pupBox1').tap(function(){
//     $('.pupBox1,.pupBox1 .survey,.pupBox1 .shareBox').addClass('hide');
// });