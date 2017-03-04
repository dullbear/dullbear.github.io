var docEl = document.documentElement;
fontEl = document.createElement('style'),
	autoWidth();

function autoWidth() {
	//获取屏幕宽度
	clientW = $(window).width();

	if(clientW <= 1024)="" {="" clientw="1024" }="" else="" if(clientw="">= 1920) {
		clientW = 1920
	}
	// 动态写入样式

	fontEl.id = "styleHtml";
	fontEl.innerHTML = 'html{font-size:' + clientW / 19.2 + 'px!important;}';
	docEl.firstElementChild.appendChild(fontEl);
};
var time;
//模拟第三屏悬浮
function simulate(oDiv, sibli) {
	var $li = $(oDiv),
		$len = $li.length,
		s = -1;

	time = setInterval(function() {
		s += 1;
		$li.eq(s).addClass('current').siblings(sibli).removeClass('current');
		if(s == $len) {
			clearInterval(time);
		}
	}, 800);
};
(function() {
	var winHeight = $(window).height(),
		floorLength = $('.content').length,
		floorCoord = [],
		Index = 0,
		flag = true,
		showtime;

	var getCurrentEle = function() {
		/// <summary>获取当前滚动条位置最近的标签= floorCoord[index]) {
				maxIndex = index;
			}
		});

		//序号		
		$('#orderPage a').eq(maxIndex).addClass('on').siblings('a').removeClass('on');

		//是否显示 分享和底部
		if(maxIndex >= floorLength - 1) {
			$('#nextPage').css('display', 'none');
		} else {
			$('#nextPage').css('display', 'block');
		}

		return maxIndex;

	};
	var resizeTime;
	$(window).resize(function() {
		window.clearTimeout(resizeTime);
		resizeTime = window.setTimeout(
			function() {
				winHeight = $(window).height();
				$('.content').css('height', winHeight + "px");
				floorCoord = [];
				for(var i = 0; i < floorLength; i++) {
					floorCoord.push(winHeight * i);
				}
				getCurrentEle();

			}, 500);

	});

	//滚动
	$(window).scroll(function(event) {

		var _index = getCurrentEle();
		if(_index != Index) {
			Index = _index;
			//$('.content').eq(_index).addClass('hide').siblings('.content').removeClass('hide');
		}
		return false;
	});

	//鼠标中轴滚动
	$(document).mousewheel(function(e, delta, deltaX, deltaY) {
		var index = getCurrentEle();

		if(delta == 1) {
			//上
			if(index > 0) {
				play(index - 1);
			}
		} else if(delta == -1) {
			//下
			if(index < floorLength - 1) {
				play(index + 1);
			}
		}
		return false;
	});

	//点击滚动下一屏
	$('#nextPage').click(function() {
		var index = getCurrentEle();
		if(index < floorLength - 1) {
			play(index + 1);
		}
	});

	var screen1 = true,
		screen2 = true;

	var play = function(index) {
		
		if(!flag) return;
		
		flag = false;
		$('.content').eq(index).addClass('current');
//		if(index == 1) {
//			if(screen1) {
//				clearInterval(time);
//				$('.content1 .c1img').removeClass('current');
//
//			}
//			screen1 = false;
//		} else if(index == 2) {
//			if(screen2) {
//				clearInterval(time);
//				$('.content2 .c2img').removeClass('current');
//				//simulate('#showDemo li', 'li');
//			}
//			screen2 = false;
//		} 

		if(index == 1) {
			var setTime;
			window.clearTimeout(setTime);
			setTime = window.setTimeout(function() {
				aboutHeight();
			}, 3000);

		} else {
			window.clearInterval(moveTime);
		}

		$("html:not(:animated), body:not(:animated)").stop().animate({
			"scrollTop": floorCoord[index]
		}, 500, function() {
			flag = true;
		});
	};

	//滚动到顶部
	function scrollTOP() {
		$("html:not(:animated), body:not(:animated)").animate({
			"scrollTop": 0
		}, 500);
		return false;
	};

	scrollTOP();

	//点击序号滚动
	$('#orderPage a').click(function() {
		var index = $(this).index(),
			len = $('#navList li').length;
		//是否是点击回顶部
		if(index == len - 1) {
			scrollTOP();
		} else {
			play(index);
		}
	});

})();

//窗口大小改变刷新页面
window.addEventListener("resize", function() {
	$('#styleHtml').remove();
	autoWidth();
}, false);

function loading() {
	//初始页面加载
	var w = 15;
	$('#time').text(w);
	$('.startLoading').animate({'opacity':0},w*1000);
	$('.content1').animate({'opacity':1},w*1000);
	var time1 = window.setInterval(function() {
		w -= 1;
		$('#time').text(w);
		console.log(w);
		if(w == 0) {
			$('.startLoading').remove();
			window.clearInterval(time1);
			$(window).resize();
		}
	},1000);
};

function loading1() {
	//初始页面加载
	var w = 1;
	$('#time').text(w);
	$('.startLoading').animate({'opacity':0},w*1000);
	$('.content1').animate({'opacity':1},w*1000);
	var time1 = window.setInterval(function() {
		w -= 1;
		$('#time').text(w);
		console.log(w);
		if(w == 0) {
			$('.startLoading').remove();
			window.clearInterval(time1);
			$(window).resize();
		}
	},1000);
};

//设置cookie
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while(c.charAt(0) == ' ') c = c.substring(1);
		if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
	}
	return false;
}

if(getCookie('once') == "have") {
	loading1();
} else {
	loading();
	setCookie('once', 'have', 1000);	
}

//图片滚动
var $ul = $('#scroll'),
	$li = $('#scroll li'),
	len = Math.ceil($li.length / 5),
	index = 0,
	liWidth = $li.outerWidth(true);

function scrollImgPlay(index) {
	$ul.stop().animate({
		'margin-left': -5 * index * liWidth
	});
};

$('#nextBtn').click(function() {
	liWidth = $li.outerWidth(true);
	index += 1;
	if(index >= len) {
		index = len - 1;
		return false;
	}
	scrollImgPlay(index);
});

$('#prevBtn').click(function() {
	liWidth = $li.outerWidth(true);
	index -= 1;
	if(index <= -1)="" {="" index="0;" return="" false;="" }="" scrollimgplay(index);="" });="" $li.click(function()="" $('#pupwrap').removeclass('hide');="" $('#closebtn').click(function()="" $('#pupwrap').addclass('hide');="" var="" $showpicli="$('#showPic" li'),="" showlen="$showPicLi.length," current="0;" function="" showpicplay(current)="" $showpicli.eq(current).fadein(400).siblings('li').fadeout(400);="" };="" $('#nextbtn1').click(function()="" +="1;" if(current="">= showLen) {
		current = 0;
	}
	showPicPlay(current);
});

$('#prevBtn1').click(function() {
	current -= 1;
	if(current <= -1)="" {="" current="showLen" -="" 1;="" }="" showpicplay(current);="" });="" var="" movetime,="" movetimenum="0;" function="" aboutheight()="" $aboutmove="$('#aboutMove')," height="$aboutMove.outerHeight(true)" $('.auboutus').outerheight(true);="" window.clearinterval(movetime);="" movetime="setInterval(function()" +="1;" if(movetimenum="">= height) {
			moveTimeNum = 0;
		}
		$aboutMove.stop().css({
			"margin-top": -moveTimeNum + "px"
		});
	}, 100);
};

$('#aboutMove').mouseenter(function() {
	window.clearInterval(moveTime);
}).mouseleave(function() {
	aboutHeight();
});

$('#contact .contactIcon').mouseenter(function(){
	var _this=$(this);
	_this.addClass('current');
}).mouseleave(function(){
	var _this=$(this);
	_this.removeClass('current');
});

/* 案例tag */
$('#showDemo li').mouseenter(function(){
	var _this=$(this);
	_this.addClass('current').siblings('li').removeClass('current');
	//请求
});

if(document.all) {
	document.onselectstart = function() {
		return false;
	}; //for ie
} else {
	document.onmousedown = function() {
		return false;
	};
	document.onmouseup = function() {
		return true;
	};

}

document.onselectstart = new Function('event.returnValue=false;');</=></=></summary></=>