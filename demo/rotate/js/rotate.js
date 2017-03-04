//设置cookie

if (getCookie('rotate', 0) === undefined) {
    setCookie('rotate', 'len=0', 1000 * 60 * 60 * 24);
}


var rotatePic = document.querySelector("#rotate-pic"),
    i = 45,
    sum = 0,
    flag = true,
    rotateArray = [0, 2, 4, 6],
    rotatePrize = {
        0: '谢谢参与测试抽奖活动',
        1: '无线路由器',
        2: '谢谢参与测试抽奖活动',
        3: '三星note8790',
        4: '谢谢参与测试抽奖活动',
        5: '时尚电脑包',
        6: '谢谢参与测试抽奖活动',
        7: '华为C8915',
    };

document.querySelector('#rotate-btn').addEventListener('click', function(e) {
    var len = getCookie('rotate', 0);
    if (len < 3) {
        if (flag == true) {
            Tran();
        }
    } else {
        alert('你今天的幸运值已经用完，明天再来吧！');
    }
});

document.querySelector('#rotate-btn').addEventListener('touchstart', function(e) {
    var len = getCookie('rotate', 0);
    if (len > 3) {
        if (flag == true) {
            Tran();            
        }
    } else {
        alert('你今天的幸运值已经用完，明天再来吧！');
    }
});

function num() {
    /* 获取年月日*/
    var myDate = new Date();
    year = myDate.getFullYear();
    month = myDate.getMonth() + 1;
    date = myDate.getDate();

    /* 转换成毫秒 */
    currentDate = year + '/' + month + '/' + date + ' ' + '00:00:00';
    currentTime = (new Date(currentDate)).getTime();

    /* 获取当前毫秒值 */
    nowTime = myDate.getTime();

    /* 获取离明天凌晨毫秒值作为cookie过期时间 */
    tomTime = 1000 * 60 * 60 * 24 - (nowTime - currentTime);

    /* 获取抽奖次数 */
    var len = getCookie('rotate', 0);
    len++;
    setCookie('rotate', 'len=' + len, tomTime);
};

function Tran() {
    flag = false;
    var randomFigure = parseInt(Math.random() * rotateArray.length), //获取规定数字随机序号
        ruleFigure = rotateArray[randomFigure], //获取规定产品转盘位置
        ratateTxt = rotatePrize[ruleFigure]; //获取规定产品名字   
    sum = (Math.ceil(sum / 360) + 2) * 360 + ruleFigure * i;
    rotatePic.style.MozTransform = "rotate(" + sum + "deg)";
    rotatePic.style.webkitTransform = "rotate(" + sum + "deg)";
    rotatePic.style.OTransform = "rotate(" + sum + "deg)";
    rotatePic.style.msTransform = "rotate(" + sum + "deg)";
    setTimeout(function() {
        num();
        var len = getCookie('rotate', 0);
        document.getElementById('num-show').innerHTML = 3 - len;
        alert(ratateTxt);
        flag = true;
    }, 1300);
};