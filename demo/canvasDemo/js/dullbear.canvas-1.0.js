//全局命名空间
var dullBear = {};

//画布方法枚举
var drawEvtEumn = {

};


(function() {

	dullBear.Canvas = function(idName, width, height) {
		if (isNaN(width) && isNaN(height) && typeof idName != "string") {
			return false;
		}
		this.idName = document.querySelector("#" + idName);

		if (!this.idName.getContext) {
			console.log('您的浏览器不支持画布，请更换浏览器！');
			return false;
		} else {
			this.width = width;
			this.height = height;
			this.flag = false;
			this.init();
		}
	};

	dullBear.Canvas.prototype = {
		init: function() {
			//设置画布宽度
			this.idName.setAttribute('width', this.width);
			//设置画布高度
			this.idName.setAttribute('height', this.height);
			this.canvas = this.idName.getContext('2d');
			//初始x轴
			this.startX = 0;
			//初始Y轴
			this.startY = 0;
			//结束x轴
			this.endX = 0;
			//结束Y轴
			this.endY = 0;
			//初始化笔刷类型
			this.drawBrushType = "LineFree";
			//颜色
			this.color = "#ff6600";
			//粗细
			this.weight = 1;
			//字体大小
			this.fontSize = 14;
			//行高
			this.fontLine = 16;
			//字体
			this.family = "Arial";
			//历史记录颜色值数组
			this.colorData = [];
			//路径数组
			this.pathData = [];
			//颜色信息最大长度
			this.maxHistoryLength = 20000;
			//当前历史位置
			this.historyCurrent = -1;
			//是否拖拽
			this.isDrop = false;
			//拖拽中
			this.current = 0;
			//是否在路径中
			this.isPoint = false;
			//初始化颜色
			this.drawSetGlobalVariable({
				"color": "#000"
			});

			this.x = 0;
			this.y = 0;
		},
		//全局变量
		drawSetGlobalVariable: function(obj) {
			if (typeof obj == "object") {

				this.color = obj.color || this.color;

				this.weight = obj.weight || this.weight;

				//填充颜色
				this.canvas.fillStyle = this.color;
				//线条颜色
				this.canvas.strokeStyle = this.color;
				//线条大小
				this.canvas.lineWidth = this.weight;
			}
		},
		//设置笔刷类型
		drawSetBrush: function(type) {
			this.drawBrushType = type;
		},
		//鼠标按下
		drawMouseDown: function(x, y) {
			if (isNaN(x) && isNaN(y)) {
				return false;
			}

			this.flag = true;
			this.startX = x;
			this.startY = y;
			//非拖拽模式
			if (!this.isDrop) {
				this.drawDefaultDown(x, y);
			} else {
				this.drawDropDown(x, y);
			}

		},
		//鼠标移动
		drawMouseMove: function(x, y) {
			if (isNaN(x) && isNaN(y) || !this.flag) {
				return false;
			}
			this.endX = x;
			this.endY = y;
			//非拖拽模式
			if (!this.isDrop) {
				this.drawDefaultMove(x, y);
			} else {
				this.drawDropMove(x, y);
			}

		},
		//鼠标移动松开
		drawMouseEnd: function() {
			if (this.flag && this.endX != 0 && this.endY != 0 && !this.isDrop) {

				this.drawGetImageData();
				this.pathData.push({});
				this.pathData[this.pathData.length - 1]['draw' + this.drawBrushType] = {
					"sx": this.startX,
					"sy": this.startY,
					"ex": this.endX,
					"ey": this.endY,
					"color": this.color,
					"weight": this.weight
				}
			}
			this.endX = 0;
			this.endY = 0;
			this.flag = false;
			this.isPoint = false;
		},
		//默认无拖拽按下
		drawDefaultDown: function() {
			switch (this.drawBrushType) {
				case "LineFree":
					{
						this.canvas.beginPath();
						break;
					}
				case "Font":
					{
						this.drawFontEvt();
						break;
					}
				default:
					{
						this.canvas.beginPath();
						this.drawNextInfo = this.canvas.getImageData(0, 0, this.width, this.height);
						break;
					}
			}
		},
		//拖拽按下
		/*drawDropDown: function(x, y) {
			var len = this.pathData.length;

			if (len <= 0) {
				return false;
			}

			for (var i = len - 1; i >= 0; i--) {
				var currentDraw = this.pathData[i];
				for (var name in currentDraw) {
					if (name == 'round') {
						this.isPoint = eval('this.' + name + '(' + currentDraw[name].sx + ',' + currentDraw[name].sy + ',' + Math.abs(currentDraw[name].ex - currentDraw[name].sx) + ')');
					} else if (name == "RoundStroke") {
						this.isPoint = eval('this.' + name + '(' + currentDraw[name].sx + ',' + currentDraw[name].sy + ',' + currentDraw[name].ex + ',' + currentDraw[name].ey + ')');
					} else {
						this.isPoint = eval('this.' + name + '(' + currentDraw[name].sx + ',' + currentDraw[name].sy + ',' + currentDraw[name].ex + ',' + currentDraw[name].ey + ')');
					}

				}
				if (this.isPoint) {
					this.current = i;
					return false;
					break;
				}
			}
		},*/
		//默认无拖拽移动
		drawDefaultMove: function(x, y) {
			switch (this.drawBrushType) {
				case "Line":
					{
						//清除画布
						this.drawClear();
						//重绘上一步
						this.canvas.putImageData(this.drawNextInfo, 0, 0, 0, 0, this.width, this.height);
						this.drawLine(this.startX, this.startY, x, y);
						break;
					}

				case "LineFree":
					{
						//移动绘制位置
						this.canvas.lineTo(x, y);
						//沿着坐标点顺序的路径绘制直线
						this.canvas.stroke();
						break;
					}
				case "Rect":
					{
						//清除画布
						this.drawClear();
						//重绘上一步
						this.canvas.putImageData(this.drawNextInfo, 0, 0, 0, 0, this.width, this.height);
						this.drawRect(this.startX, this.startY, x - this.startX, y - this.startY);
						break;
					}
				case "RectStroke":
					{
						//清除画布
						this.drawClear();
						//重绘上一步
						this.canvas.putImageData(this.drawNextInfo, 0, 0, 0, 0, this.width, this.height);
						this.drawRectStroke(this.startX, this.startY, x - this.startX, y - this.startY);
						break;
					}
				case "Round":
					{
						//清除画布
						this.drawClear();
						//重绘上一步
						this.canvas.putImageData(this.drawNextInfo, 0, 0, 0, 0, this.width, this.height);
						this.drawRound(this.startX, this.startY, Math.abs(x - this.startX));
						break;
					}
				case "RoundStroke":
					{
						//清除画布
						this.drawClear();
						//重绘上一步
						this.canvas.putImageData(this.drawNextInfo, 0, 0, 0, 0, this.width, this.height);
						this.drawRoundStroke(this.startX, this.startY, x, y);
						break;
					}
				case "Arrow":
					{
						//清除画布
						this.drawClear();
						//重绘上一步
						this.canvas.putImageData(this.drawNextInfo, 0, 0, 0, 0, this.width, this.height);
						this.drawArrow(this.startX, this.startY, x, y);
						break;
					}
			}
		},
		//拖拽移动
		/*drawDropMove: function(x, y) {
			var len = this.pathData.length;

			if (len <= 0 && !this.isPoint) {
				return false;
			}
			this.drawClear();

			for (var i = len - 1; i >= 0; i--) {
				var currentDraw = this.pathData[i];
				for (var name in currentDraw) {
					if (name == "drawLine") {
						var dropSx = x - this.startX + currentDraw[name].sx,
							dropSy = y - this.startY + currentDraw[name].sy,
							dropEx = Math.abs(x - this.startX + currentDraw[name].ex),
							dropEy = Math.abs(y - this.startY + currentDraw[name].ey);
						if (this.current == i) {
							eval('this.' + name + '(' + dropSx + ',' + dropSy + ',' + dropEx + ',' + dropEy + ')');
						} else {
							eval('this.' + name + '(' + currentDraw[name].sx + ',' + currentDraw[name].sy + ',' + dropEx + ',' + dropEy + ')');
						}
					} else if (name == 'drawRect' || name == "drawRectStroke") {
						var dropSx = x - this.startX + currentDraw[name].sx,
							dropSy = y - this.startY + currentDraw[name].sy,
							dropEx = Math.abs(currentDraw[name].ex - currentDraw[name].sx),
							dropEy = Math.abs(currentDraw[name].ey - currentDraw[name].sy);
						if (this.current == i) {
							eval('this.' + name + '(' + dropSx + ',' + dropSy + ',' + dropEx + ',' + dropEy + ')');
						} else {
							eval('this.' + name + '(' + currentDraw[name].sx + ',' + currentDraw[name].sy + ',' + dropEx + ',' + dropEy + ')');
						}
					} else if (name == "drawRound") {

						var dropSx = x - this.startX + currentDraw[name].sx,
							dropSy = y - this.startY + currentDraw[name].sy,
							dropEx = Math.abs(currentDraw[name].ex - currentDraw[name].sx);
						if (this.current == i) {
							eval('this.' + name + '(' + dropSx + ',' + dropSy + ',' + dropEx + ')');
						} else {
							eval('this.' + name + '(' + currentDraw[name].sx + ',' + currentDraw[name].sy + ',' + dropEx + ')');
						}
					}
					ex = ey = null;
				}

			}
		},*/

		//图片
		drawImg: function(imgUrl, x, y, width, height) {
			if (typeof imgUrl != "string" && isNaN(x) && isNaN(y) && isNaN(width) && isNaN(height)) {
				return false;
			}
			var that = this;
			var img = new Image();

			img.onload = function() {
				that.canvas.drawImage(img, x, y, width, height);
				that.drawGetImageData();
			}
			img.onerror = function() {
				console.log('图片加载错误！');
			}
			img.src = imgUrl;
		},
		//获取文字宽度
		drawGetTxtWidth: function(text) {
			this.canvas.font = '14px Arial';
			return this.canvas.measureText(text).width;
		},
		//文字
		drawFont: function(text, x, y) {
			this.canvas.font = "14px/16px Arial";
			this.canvas.fillText(text, x, y);
		},
		//线条
		drawLine: function(sx, sy, ex, ey) {
			//开始路径
			this.canvas.beginPath();
			//开始位置
			this.canvas.moveTo(sx, sy);
			//移动绘制位置
			this.canvas.lineTo(ex, ey);

			if (this.isDrop && this.endX == 0 && this.endY == 0) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//沿着坐标点顺序的路径绘制直线
				this.canvas.stroke();
			}
		},
		//矩形
		drawRect: function(sx, sy, ex, ey) {
			//开始路径
			this.canvas.beginPath();

			//开始位置
			this.canvas.rect(sx, sy, ex, ey);
			if (this.isDrop && this.endX == 0 && this.endY == 0) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//沿着坐标点顺序的路径绘制直线
				this.canvas.fill();
			}

		},
		//矩形框
		drawRectStroke: function(sx, sy, ex, ey) {
			//开始路径
			this.canvas.beginPath();
			//开始位置
			this.canvas.rect(sx, sy, ex, ey);

			if (this.isDrop && this.endX == 0 && this.endY == 0) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//沿着坐标点顺序的路径绘制直线
				this.canvas.stroke();
			}
		},
		//圆形
		drawRound: function(sx, sy, ex) {

			//开始路径
			this.canvas.beginPath();
			//圆形大小
			this.canvas.arc(sx, sy, ex, 0, Math.PI * 2);

			if (this.isDrop && this.endX == 0 && this.endY == 0) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//绘制圆形
				this.canvas.fill();
			}
		},
		//椭圆
		drawRoundStroke: function(sx, sy, ex, ey) {
			var centerPointX, centerPointY,
				a = parseInt(Math.abs(sx - ex) / 2),
				b = parseInt(Math.abs(sy - ey) / 2),
				r = (a > b) ? a : b,
				ratioX = a / r, //横轴缩放比率
				ratioY = b / r; //纵轴缩放比率
			centerPointX = Math.min(sx, ex) + a;
			centerPointY = Math.min(sy, ey) + b;
			this.canvas.save();
			//开始路径
			this.canvas.beginPath();

			this.canvas.scale(ratioX, ratioY); //进行缩放（均匀压缩）
			//圆形大小
			this.canvas.arc(centerPointX / ratioX, centerPointY / ratioY, r, 0, Math.PI * 2);
			if (this.isDrop) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//绘制圆形
				this.canvas.stroke();
			}
			this.canvas.restore();
		},
		//画箭头
		drawArrow: function(sx, sy, ex, ey) {
			//自由直线
			this.canvas.beginPath();
			this.canvas.moveTo(sx, sy);
			this.canvas.lineTo(ex, ey);

			if (this.isDrop) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//自由直线
				this.canvas.stroke();
			}

			this.canvas.closePath();

			//箭头
			this.canvas.save();
			this.canvas.beginPath();
			this.canvas.translate(ex, ey);
			var ang = (ex - sx) / (ey - sy);
			ang = Math.atan(ang);
			if (ey - sy >= 0) {
				this.canvas.rotate(-ang);
			} else {
				this.canvas.rotate(Math.PI - ang); //加个180度，反过来  
			}
			//箭头样式
			this.canvas.lineTo(-5, -10);
			this.canvas.lineTo(0, -5);
			this.canvas.lineTo(5, -10);
			this.canvas.lineTo(0, 0);

			if (this.isDrop) {
				return this.canvas.isPointInPath(this.startX, this.startY)
			} else {
				//绘制箭头
				this.canvas.fill();
			}

			this.canvas.restore();
			this.canvas.closePath();
		},
		drawFontEvt: function() {
			var that = this,
				x = 0,
				y = 0,
				$textFont = $('#textFont'),
				textWidth = 16,
				textHeight = 16,
				txtMaxWidth = this.width - this.startX - 10,
				txtMaxHeight = this.height - this.startY - 10,
				time = null;

			if ($textFont.hasClass('hide')) {
				this.x = this.startX;
				this.y = this.startY;
				//初始化输入框
				$textFont.css({
					'border-color': this.color,
					'color': this.color,
					'font-zie': this.fontSize + "px",
					'width': textWidth + "px",
					'height': textHeight + "px",
					'left': this.startX + "px",
					'top': this.startY + "px",
					'max-width': txtMaxWidth + "px",
					'max-height': txtMaxHeight + "px"
				}).removeClass('hide');

				//为文本框获取焦点
				clearTimeout(time);
				time = setTimeout(function() {
					$('#textFont').focus();
				}, 300);

				var that = this;
				$textFont.bind('input', function() {
					var txt = $textFont.val(),
						lastIndex = txt.lastIndexOf('\n'),
						putValTxt = '',
						lastTxt = txt;

					if (lastIndex != -1) {
						putValTxt = txt.substr(0, lastIndex);
						lastTxt = txt.substr(lastIndex, txt.length);
						getWidth(putValTxt, lastTxt)
					} else {
						getWidth(putValTxt, lastTxt);
					}

				});
			} else {
				//将文字画入画布
				var txt = $textFont.val(),
					txtArr = txt.split('\n');
				for (var i = 0; i < txtArr.length; i++) {
					that.drawFont(txtArr[i], this.x + 5, this.y + (i + 1) * that.fontLine + 2);
				}
				//隐藏重置文本框
				$textFont.css({
					'width': textWidth + "px",
					'height': textHeight + "px"
				}).val('').unbind('input').addClass('hide');

				this.drawGetImageData();

			}

			function getWidth(defaultTxt, splitTxt) {
				var startSplitTxt = '',
					endSplitTxt = '',
					txtArr = [];
				//为文本框自动断行
				for (s = 0; s < splitTxt.length; s++) {
					//获取写入画布文字长度
					var lastWidth = that.drawGetTxtWidth(splitTxt.substring(0, s));
					if (lastWidth >= txtMaxWidth) {
						startSplitTxt = splitTxt.substring(0, s - 1) + "\n";
						endSplitTxt = splitTxt.substring(s - 1, splitTxt.length);
						$textFont.val(defaultTxt + startSplitTxt + endSplitTxt);
						break;
					} else {
						$textFont.val(defaultTxt + splitTxt);
					}
				}
				//获取文本框最大宽度
				textWidth = Math.max(textWidth, that.drawGetTxtWidth(splitTxt));

				//获取文本框高宽
				txtArr = $textFont.val().split('\n');
				$textFont.css({
					"height": txtArr.length * that.fontLine + "px",
					'width': textWidth
				});

			}
		},
		//最大历史记录
		drawAddHistory: function(dataInfo) {
			console.log(dataInfo);
			if (this.colorData.length >= this.maxHistoryLength) {
				this.colorData.shift();
				this.colorData.push(dataInfo);
			} else {
				this.colorData.push(dataInfo);
			}
			this.historyCurrent = this.colorData.length - 1;
			console.log("历史记录" + this.historyCurrent);
			console.log(this.colorData);
			console.log('总长度:' + this.colorData.length);
		},
		//上一步
		drawPrev: function() {

			this.historyCurrent -= 1;
			console.log("上一步" + this.historyCurrent);
			if (this.historyCurrent == -1 && this.colorData.length < this.maxHistoryLength) {
				this.drawClear();
				return false;
			} else if (this.historyCurrent <= -1) {
				this.historyCurrent = -1;
				console.log('没有上一步啦！');
				return false;
			}

			this.drawPutImageData(this.historyCurrent);

		},
		//下一步
		drawNext: function() {
			this.historyCurrent += 1;
			if (this.historyCurrent >= this.colorData.length) {
				this.historyCurrent = this.colorData.length - 1;
				console.log('没有下一步啦！');
				return false;
			}

			this.drawPutImageData(this.historyCurrent);
		},
		//设置拖拽
		drawDrop: function() {
			this.isDrop = !this.isDrop;
			console.log(this.isDrop);
		},
		//获取画布信息
		drawGetImageData: function() {

			this.drawAddHistory(this.canvas.getImageData(0, 0, this.width, this.height));

		},
		//输出保存的画布信息
		drawPutImageData: function(index) {
			this.canvas.putImageData(this.colorData[index], 0, 0, 0, 0, this.width, this.height);
		},
		//清除画布
		drawClear: function() {
			this.canvas.clearRect(0, 0, this.width, this.height);
		},
		//保存图片
		drawSavse: function() {
			var myCanvas = document.getElementById("myCanvas");
			// here is the most important part because if you dont replace you will get a DOM 18 exception.
			// var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");
			var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			window.location.href = image;

			/*var mycanvas = document.getElementById("myCanvas");
			var image = mycanvas.toDataURL("image/png");
			var w = window.open('about:blank', 'image from canvas');
			w.document.write("<img src='" + image + "' alt='from canvas'/>");*/
		}
	};
})();


var headHeight = $('#header').height(),
	footHeight = $('#footer').height(),
	winHeight = $(document).height()- footHeight,
	winWidth = $(document).width();

var Canvas = new dullBear.Canvas('myCanvas', winWidth, winHeight);

/* 选择按钮 */
function choose(dataFun) {
	if (typeof dataFun != "string") {
		return false;
	}
	//隐藏弹窗
	$('.brushType').addClass('hide');
	if (dataFun == "prev") { //上一步
		Canvas.drawPrev();
	} else if (dataFun == "next") { //上一步
		Canvas.drawNext();
	} else if (dataFun == "drop") { //拖拽
		Canvas.drawDrop();
	} else if (dataFun == "tool") { //工具
		$('#canvasBrush').removeClass('hide');
	} else if (dataFun == "color") { //颜色
		$('#brushColorBox').removeClass('hide');
	} else if (dataFun == "weight") { //粗细
		$('#brushWeightBox').removeClass('hide');
	}

};

/* 选择工具 */
function chooseTool(dataType) {
	if (typeof dataType != "string") {
		return false;
	}
	Canvas.drawSetBrush(dataType);
	$('.brushType').addClass('hide')
};

/* 选择颜色 */
function chooseColor(dataColor) {
	if (typeof dataColor != "string") {
		return false;
	}
	Canvas.drawSetGlobalVariable({
		"color": dataColor
	});
	$('.brushType').addClass('hide')
};

/* 选择粗细 */
function chooseWeight(dataWeight) {
	if (typeof dataWeight != "string") {
		return false;
	}
	Canvas.drawSetGlobalVariable({
		"weight": dataWeight
	});
	$('.brushType').addClass('hide')
};

/* pc端 */
(function() {
	$('#myCanvas').mousemove(function(e) {
		Canvas.drawMouseMove(e.pageX, e.pageY - headHeight, 'rgba(255, 255, 0, 1)', 1);
	}).mousedown(function(e) {
		//隐藏弹窗
		$('.brushType').addClass('hide');
		Canvas.drawMouseDown(e.pageX, e.pageY - headHeight);
		console.log(e.pageY);

	});
	$(window).mouseup(function() {
		Canvas.drawMouseEnd();
	});

	//画布操作
	$('#tools li[data-fun]').click(function(e) {
		var dataFun = $(this).attr('data-fun');
		choose(dataFun);
		console.log(dataFun);
	});


	//选择工具
	$('#canvasBrush li[data-type]').click(function() {
		var dataType = $(this).attr('data-type');

		/*	chooseTool(dataType);*/
		//背景
		if (dataType == "Images") {
			Canvas.drawImg('images/1.jpg', 0, 0, winWidth, winHeight);
			$('.brushType').addClass('hide');
		} else {
			chooseTool(dataType);

		}



	});

	//选择颜色
	$('#brushColorBox li[data-color]').click(function() {
		var dataColor = $(this).attr('data-color');
		chooseColor(dataColor);
	});

	//选择粗细
	$('#brushColorBox li[data-weight]').click(function() {
		var dataWeight = $(this).attr('data-weight');
		chooseWeight(dataWeight);
	});
})();

/* 移动端 */
(function() {
	var myCanvas = document.querySelector('#myCanvas');
	//手指按下
	myCanvas.addEventListener("touchstart", function(e) {
		if (e.changedTouches) {
			e = e.changedTouches[e.changedTouches.length - 1];
		}
		//隐藏弹窗
		$('.brushType').addClass('hide');
		Canvas.drawMouseDown(e.pageX, e.pageY);
	});

	//手指移动
	myCanvas.addEventListener("touchmove", function(e) {
		e.preventDefault();
		if (e.changedTouches) {
			e = e.changedTouches[e.changedTouches.length - 1];
		}
		Canvas.drawMouseMove(e.pageX, e.pageY);
	});

	//手指拿开
	myCanvas.addEventListener("touchend", function(e) {
		if (e.changedTouches) {
			e = e.changedTouches[e.changedTouches.length - 1];
		}
		Canvas.drawMouseEnd(e.pageX, e.pageY);
	});

	//画布操作
	$('#tools li[data-fun]').tap(function(e) {
		var dataFun = $(this).attr('data-fun');
		choose(dataFun);
		console.log(dataFun);
	});

	//选择工具
	$('#canvasBrush li[data-type]').tap(function() {
		var dataType = $(this).attr('data-type');
		chooseTool(dataType);
	});

	//选择颜色
	$('#brushColorBox li[data-color]').tap(function() {
		var dataColor = $(this).attr('data-color');
		chooseColor(dataColor);
	});

	//选择粗细
	$('#brushColorBox li[data-weight]').tap(function() {
		var dataWeight = $(this).attr('data-weight');
		chooseWeight(dataWeight);
	});

})();