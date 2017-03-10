(function() {

	var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return { //移动终端浏览器版本信息
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}

	var winHeight = 0,
		startY = 0,
		endY = 0,
		floorCoord = [],
		index = 0,
		len = $('.content').length;

	//获取屏幕高度
	if (browser.versions.mobile && browser.versions.android) {
		winHeight = window.screen.availHeight / window.devicePixelRatio;
	} else if (browser.versions.mobile && browser.versions.iPhone) {
		winHeight = window.screen.availHeight;
	} else {
		winHeight = $(window).height();
	}

	$('.content,.shareCoursePup').css('height', winHeight + 'px');
	$('.content1').css('height', winHeight - 50 + 'px');

	//添加高度
	for (var i = 0; i < len; i++) {
		floorCoord.push(i * winHeight);
	}

	//滚动
	function play(index) {

		$("html:not(:animated), body:not(:animated)").stop().animate({
			"scrollTop": floorCoord[index]
		}, 500);

		$('.content').eq(index).addClass('current');

		if (index == len - 1) {
			$('#down').css('display', 'none');
		}


		return false;
		e.preventDefault();
	};

	console.log(floorCoord);


	//向下箭头点击
	$('#down')[0].addEventListener("click", function(e) {
		if (index >= len - 1) {
			return false;
		}
		index += 1;
		play(index);
	}, false);

	//手指按下
	document.addEventListener("touchstart", function(e) {
		startY = e.touches[0].pageY;
		endY = 0;
	}, false);

	//手指移动
	document.addEventListener("touchmove", function(e) {
		e.preventDefault();
		if (Math.abs(e.touches[0].pageY - startY) > 10) {
			endY = e.touches[0].pageY - startY;
		} else {
			endY = 0;
		}
	}, false);

	//手指松开
	document.addEventListener("touchend", function(e) {
		console.log(endY);
		if (endY > 0) {
			if (index <= 0) {
				return false;
			}
			index -= 1;
			play(index);

		} else if (endY < 0) {
			if (index >= len - 1) {
				return false;
			}
			index += 1;
			play(index);
		}
	}, false);

	//关注微博
	document.getElementById('addWX').addEventListener("touchstart", function(e) {
		$('#shareCoursePup').removeClass('hide');

	}, false);

	$('#pupBox')[0].addEventListener("touchstart", function(e) {
		$('#pupBox').addClass('hide');
	}, false);

	//分享
	document.getElementById('shareBtn').addEventListener("touchstart", function(e) {
		$('#pupBox').removeClass('hide');
		return false;
	}, false);

	$('#close')[0].addEventListener("touchstart", function(e) {
		$('#shareCoursePup').addClass('hide');
	}, false);

	//初始化置顶
	$("html:not(:animated), body:not(:animated)").stop().animate({
		"scrollTop": 0
	}, 500);

	$('.content').eq(0).addClass('current');

	var audio = $('#audio')[0];
	$('#audioBtn').click(function() {		
		if (!audio.paused) {
			 $('#audio')[0].pause(); // 这个就是暂停  
			$(this).addClass('push');
		} else {
			audio.play(); // 这个就是播放
			$(this).removeClass('push');
		}
	});

})();