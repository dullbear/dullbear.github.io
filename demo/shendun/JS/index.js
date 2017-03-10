(function() {
	var winHeight = $(window).height(),
		floorLength = $('.content').length,
		floorCoord = [],
		Index = 0,
		flag = true,
		showtime;


	var getCurrentEle = function() {
		/// <summary>获取当前滚动条位置最近的标签</summa
		var Top = $(window).scrollTop(),
			maxIndex = 0;

		jQuery.each(floorCoord, function(index, el) {
			if (Top >= floorCoord[index]) {
				maxIndex = index;
			}
		});

		//序号		
		$('#orderPage li').eq(maxIndex).addClass('current').siblings('li').removeClass('current');

		//是否显示 分享和底部
		if (maxIndex >= floorLength - 1) {
			$('#nextPage').css('display', 'none');
		} else {
			$('#nextPage').css('display', 'block');
		}

		return maxIndex;

	};



	$(window).resize(function() {
		winHeight = $(window).height();
		$('.content').css('height', winHeight + "px");
		floorCoord = [];
		for (var i = 0; i < floorLength; i++) {
			floorCoord.push(winHeight * i);
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
	$('#nextPage').click(function() {
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

	function keyUp(e) {
		var currKey = 0,
			e = e || event;
		currKey = e.keyCode || e.which || e.charCode;
		var keyName = String.fromCharCode(currKey);
		var index = getCurrentEle();
		if (currKey == 33) {
			//上
			if (index > 0) {
				play(index - 1);
			}
			
		} else if (currKey == 34) {
			//下
			if (index < floorLength - 1) {
				play(index + 1);
			}
		}
		return false;

	}
	document.onkeydown = keyUp;

	function scrollTOP() {
		$("html:not(:animated), body:not(:animated)").animate({
			"scrollTop": 0
		}, 500);
		return false;
	};

	scrollTOP();

	$('.content').eq(0).addClass('current');



	//点击序号滚动
	$('#orderPage li').click(function() {
		var index = $(this).index(),
			len = $('#navList li').length;
		//是否是点击回顶部
		if (index == len - 1) {
			scrollTOP();
		} else {
			play(index);
		}
	});

})();