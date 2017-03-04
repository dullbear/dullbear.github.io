(function() {
	var winHeight = $(window).height(),
		floorLength = $('.content').length,
		floorCoord = [],
		Index = 0,
		flag = true,
		showtime;
	var eles = $(".content");


	var getCurrentEle = function() {
		/// <summary>获取当前滚动条位置最近的标签= floorCoord[index]) {
				maxIndex = index;
			}
		});

		//是否显示 分享和底部
		if (maxIndex >= floorLength - 1) {
			$('#nextBtn').css('display', 'none');
			$('#shardBox,#footer').removeClass('hide');
		} else {
			$('#nextBtn').css('display', 'block');
			$('#shardBox,#footer').addClass('hide');
		}

		//序号		
		$('#navList li').find('a').removeClass('onthis');
		$('#navList li').eq(maxIndex).find('a').addClass('onthis');

		if (maxIndex == 2) {
			$('#fastNum').text('');
			showtime = setTimeout(showTime, 500);
		}

		//显示分享
		 if (maxIndex == 0) {
		 	$('#nextBtn').css('bottom', '130px');
		 	$('#footPupBox').removeClass('hide');
		 	$('#giftRight').css('display', 'none');
		 } else {
		 	$('#nextBtn').css('bottom', '35px');
		 	$('#footPupBox').addClass('hide');
		 	$('#giftRight').css('display', 'block');
		 }
		 
		

		return maxIndex;

		 //var Height = $(window).height();
		 //var maxHeight = 0;
		 //var maxIndex = 0;
		 //eles.each(function(index, element) {
		 //	var ele = $(element);
		 //	var top = ele.offset().top;
		 //	var height = ele.outerHeight(false);
		 //	var _maxHeight = 0;
		 //	if (top > Top && top < Top + Height) {
		 //		_maxHeight = Height + Top - top;
		 //	} else if (Top > top && Top < top + height) {
		 //		_maxHeight = height + top - Top;
		 //	} else if (top == Top) {
		 //		_maxHeight = Height > height ? height : Height;
		 //	}
		 //	if (_maxHeight > maxHeight) {
		 //		maxHeight = _maxHeight;
		 //		maxIndex = index;
		 //	}
		 //	//console.log("Top:" + Top + ",Height:" + Height + ",top:" + top + ",height:" + height + "|" + _maxHeight)
		 //});
		 ////console.log(maxIndex);

		 //if (maxIndex == floorLength - 2) {
		 //	$('#nextBtn').css('display', 'none');
		 //} else {
		 //	$('#nextBtn').css('display', 'block');
		 //}


	};



	$(window).resize(function() {
		winHeight = $(window).height();
		$('.content').css('height', winHeight + "px");
		floorCoord=[];
		for (var i = 0; i < floorLength; i++) {
			floorCoord.push($('.content').eq(i).offset().top);
		}
		getCurrentEle();
	});
	$(window).resize();

	//滚动
	$(window).scroll(function(event) {
		var _index = getCurrentEle();
		if (_index != Index) {
			Index = _index;
			$('.content').eq(_index).addClass('current').siblings('.content').removeClass('current');
		}
		return false;
	});

	//鼠标中轴滚动
	$(document).mousewheel(function(e, delta, deltaX, deltaY) {
		var index = getCurrentEle();

		if (delta == 1) {
			//上
			if (index > 0) {
				play(index - 1);
			}
		} else if (delta == -1) {
			//下
			if (index < floorLength - 1) {
				play(index + 1);
			}
		}
		return false;
	});


	//点击滚动下一屏
	$('#nextBtn').click(function() {
		var index = getCurrentEle();
		if (index < floorLength - 1) {
			play(index + 1);
		}
	});

	var play = function(index) {
		if (!flag) return;
		flag = false;

		$("html:not(:animated), body:not(:animated)").stop().animate({
			"scrollTop": floorCoord[index]
		}, 500, function() {
			flag = true;
		});
	};

	function scrollTOP() {
		$("html:not(:animated), body:not(:animated)").animate({
			"scrollTop": 0
		}, 500);
	};

	scrollTOP();

	$('.content').eq(0).addClass('current');

	//ping数字
	function showTime() {
		var i = 199,
			$fastNum = $('#fastNum'),
			time;
		time = setInterval(function() {
			i -= 1;
			$fastNum.text(i);
			if (i == 99) {
				clearInterval(time);
				clearTimeout(showtime)
			}
		}, 10);
	};

	//分享礼包点击
	$('#giftRight').click(function() {
		$('#giftRight').css('display', 'none');
		$('#footPupBox').removeClass('hide');
	});

	//关闭分享
	$('#footPupBgClose').click(function() {
		$('#giftRight').css('display', 'block');
		$('#footPupBox').addClass('hide');
	});

	//右栏悬浮
	$('#jionUs li').mouseenter(function(event) {
		var index = $(this).index();
		$('#rightPopLeft .popShow').eq(index).removeClass('hide').siblings('.popShow').addClass('hide');
	});

	//点击序号滚动
	$('#navList li').click(function() {
		var index = $(this).index(),
			len = $('#navList li').length;
		//是否是点击回顶部
		if (index == len - 1) {
			scrollTOP();
		} else {
			play(index);
		}
	});

	//点击观看视频
	$('#videoBtn').click(function() {
		$('#videoPupBox').removeClass('hide');
	});

	//关闭视频弹窗
	$('#videoPupClose').click(function() {
		$('#videoPupBox').addClass('hide');
	});
    //点击名额已经满
	$('#quotaBoxBtn').click(function () {
	    $('#quotaBox').removeClass('hide');
	});
    //关闭名额已经满
	$('#quotaBoxClose').click(function () {
	    $('#quotaBox').addClass('hide');
	});
	//定义分享内容
	bShare.addEntry({
		summary: "虚荣vainglory，一年前那款震惊世界的MOBA手游，终于可以在电脑上玩啦！嘿，快来和我一起开黑，痛快虐老外！"
			//pic: "http://act.jdbbx.com/2015/QiXi/" + $('.professContent img').attr('src')
	});



})();</summary>