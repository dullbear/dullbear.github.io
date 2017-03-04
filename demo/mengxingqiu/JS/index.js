/* 
 ***** JavaScript Document
 ***** dullBear
 ***** 2015-09-14
 */

/** @define {boolean} */
var JSCOMPRESS_DEBUG = true;

//栏目个数     
var pageListNum = 9;
//暂停图片
var currentImg = 4;

//是否的头部图片区域点击
var isTopImageTouch = true;

var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: pageListNum,
    slidesPerView: 'auto',
    autoplay: 25,
    loop: true,
    coverflow: {
        rotate: 10
    }
});

//初始化滚动
window.setTimeout(function() {
    //停止滚动
    swiper.stopAutoplay();
    //滚动指定栏目
    if (currentImg >= 2) {
        swiper.slideTo(currentImg + pageListNum, 1000, true);
    } else {
        swiper.slideTo(currentImg + pageListNum * 2, 1000, true);
    }
}, 10);

$(window).scroll(function() {
    var scrollTop = $(this).scrollTop();
    if (scrollTop <= 0)="" {="" $('#gototop').css('display',="" 'none');="" }="" if="" (scrolltop="">= 100) {       
        $('#gotoTop').css('display', 'block');        
    }
});

$('#gotoTop').tap(function() {
    //回到顶部
    $(window).scrollTop(0);
});


// var galleryTop = new Swiper('.gallery-top', {
//     loop: true,
//     loopedSlides: pageListNum,
//     autoHeight: true //looped slides should be the same     
// });

// var galleryThumbs = new Swiper('.gallery-thumbs', {
//     grabCursor: true,
//     centeredSlides: true,
//     pagination: '.swiper-pagination',
//     slidesPerView: pageListNum,
//     slidesPerView: 'auto',
//     loop: true
// });


// swiper.params.control = galleryThumbs;
// galleryTop.params.control = galleryThumbs;
// galleryThumbs.params.control = galleryTop;


// //可以用于滚动请求数据
// var indexTag;
// $('#btn li').click(function() {
//     indexTag = $(this).index();
//     index = indexTag + pageListNum;
//     //是否触发头部联动
//     if (!isTopImageTouch) {
//         swiper.slideTo(index, 1000, true);
//     }

//     console.log('栏目' + indexTag);
// });

// //三级联动事件
// document.querySelector('#swiper-container').addEventListener('touchstart', function() {
//     isTopImageTouch = true;
// });

// document.querySelector('#swiper-container1').addEventListener('touchstart', function() {
//     if ($('body').hasClass('scrollHide')) {
//         isTopImageTouch = true;
//     } else {
//         isTopImageTouch = false;
//     }

// });

// document.querySelector('#swiper-container2').addEventListener('touchstart', function() {
//     if ($('body').hasClass('scrollHide')) {
//         isTopImageTouch = true;
//     } else {
//         isTopImageTouch = false;
//     }
// });


// function scroll(index) {
//     //抓取序号
//     var i;
//     if (index >= 0) {
//         i = index;
//     } else {
//         i = Math.abs(index + pageListNum);
//     }

//     //$('#swiper-container2').css('height', 'auto');

//     // $('#swiper-container2').removeAttr('style');
//     // var height=$('#swiper-container2 .swiper-slide').eq(i).height();
//     // $('#swiper-container2').height(height+'px');

//     $(window).scrollTop(1);
//     $('#btn li').eq(i).click();
// };



// var html = '<div class="item"><a href="javascript:;" target="_blank" rel="external"><img src="Delete/a1.jpg"></a><p class="itemTitle">小薇烂漫樱の花下</p> <span class="itemIcon">1029</span></div>';
// html = html + html + html + html + html + html;

// // $('#loading').click(function() {
// //     var tag = $(".searchResult_" + 1);
// //     tag.append(html);
// //     var tag = $('#swiper-container2 .searchResult_' + 1).eq(0),
// //         tagItemLength = tag.find('.item').length,
// //         tagItemHeight = tag.find('.item').eq(0).height();
// //     $('#swiper-container2 .swiper-wrapper').css('height', tagItemLength * tagItemHeight + 'px');
// //     tag.css('height', tagItemLength * tagItemHeight + 'px');
// // });</=>