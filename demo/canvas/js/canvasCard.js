//  author:dullBear 
//  site: www.dullbear.com 
//  2014-02-24  updata:2015-05-27  

var canvasAct = function(idName, width, height, color, ratio, diameter) {
    this.canvasId = $(idName);
    if (!this.canvasId[0].getContext) {
        console.log('您的浏览器不支持画布，请更换浏览器！');
        return false;
    }
    this.width = width || 160;
    this.height = height || 120;
    this.ratio = ratio || 0.1;
    this.diameter = diameter || 10;
    this.color = color || '#ddd';
    this._init();
};
canvasAct.prototype = {
    _init: function() {
        this.cxt = this.canvasId[0].getContext("2d");
        this.cxt.fillStyle = this.color;
        this.cxt.fillRect(0, 0, this.width, this.height);
        this.flag = false;
    },
    brushStart: function() {
        this.flag = true;
        console.log(5);
    },
    brushMove: function(e) {
        if (!this.flag) {
            return false;
        }
        //阻止默认事件
         e.preventDefault();

         if (e.changedTouches) {
                    e = e.changedTouches[e.changedTouches.length - 1];
                }
        //获取x/y轴位置
        var x = e.pageX - this.canvasId.position().left,
            y = e.pageY - this.canvasId.position().top;
            console.log(x);
        //开始绘制
        this.cxt.beginPath();
        //绘制圆形大小
        this.cxt.arc(x, y, this.diameter, 0, Math.PI * 2);
        //填充圆形
        this.cxt.fill();
        this.cxt.globalCompositeOperation = 'destination-out';
    },
    brushEnd: function() {
        this.flag = false;
        //拷贝了画布指定矩形的像素数据
        var data = this.cxt.getImageData(0, 0, this.width, this.height).data;
        //返回的 ImageData 对象中第一个像素的 color/alpha 信息
        for (var i = 0, j = 0; i < data.length; i += 4) {
            if (data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
                j++;
            }
        }
        if (j 