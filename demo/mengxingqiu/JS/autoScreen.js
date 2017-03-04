// window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
//     if (window.orientation === 180 || window.orientation === 0) {
//         alert('竖屏状态！');

//         orientation = 'portrait';
//         return false;
//     }
//     if (window.orientation === 90 || window.orientation === -90) {
//         alert('横屏状态！');
//         window.orientation = 180;
//         orientation = 'landscape';
//         return false;
//     }
// }, false);

//判断访问终端
var browser = {
    versions: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) //是否为移动终端

        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}


var dpr, rem, scale;

var docEl = document.documentElement;
var fontEl = document.createElement('style');
var metaEl = document.querySelector('meta[name="viewport"]'),
    clientW = 0;

 dpr = Math.round(window.devicePixelRatio || 1);
    
if (!browser.versions.mobile) {
    clientW = 480;
    docEl.style.width = '480px';
    docEl.style.margin = '0 auto';
} else {
    clientW = docEl.clientWidth;
}


rem = clientW /10;


scale = 1;


// 设置viewport，进行缩放，达到高清效果
metaEl.setAttribute('content', 'width=' + scale * clientW + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

// 设置data-dpr属性，留作的css hack之用
docEl.setAttribute('data-dpr', dpr);
console.log(rem);


// 动态写入样式
docEl.firstElementChild.appendChild(fontEl);
fontEl.id = "styleHtml";
fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';