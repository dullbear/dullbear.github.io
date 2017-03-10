/**
 * @name bdUI.dullScrollBar
 * @requires jquery.1.7.2
 * @constructor
 * @Extends jquery-1.7.2
 * @class jQuery模拟滚动条滚动插件
 * @author dullBear (site: www.dullbear.com email:dullbear.sheng@gmail.com data:2014-01-21)
 * @version 1.0
 * @site www.dullbear.com
 * @example $(".scroll-box")..dullScrollBar();
 * @ param {object} 插件默认参数 以下是键值
 * @ param {scrollWrap:idName/className}  赋值后调用this.$scrollWrap 模拟滚动盒子
 * @ param {scrollBox:idName/className}  赋值后调用this.$scrollBox 模拟滚动区域
 * @ param {scrollTopBtn:idName/className}  赋值后调用this.$scrollTopBtn 点击向上滚动按钮
 * @ param {scrollPor:idName/className}  赋值后调用this.$scrollPor 滚动条
 * @ param {scrollPorBtn:idName/className}  赋值后调用this.$scrollPorBtn 滚动按钮
 * @ param {scrollDownBtn:idName/className}  赋值后调用this.$scrollDownBtn 点击向下滚动按钮
 * @ param {speed:number}  赋值后调用this.speed 点击滚动高度
 */

;
(function($) {

	var bdUI = bdUI || {};
	$.fn.dullScrollBar = function(options) {
		var pName = 'dullScrollBar';
		var objData = $(this).data(pName);
		if (typeof objData == 'string' && objData == 'instance') {
			return objData;
		};
		var options = $.extend({}, bdUI.dullScrollBar.defaults, options || {});
		return $(this).each(function() {
			var dullScrollBar = new bdUI.dullScrollBar(options);
			dullScrollBar.$element = $(this);
			dullScrollBar._init();
			$(this).data(pName, dullScrollBar);
		});
	};

	bdUI.dullScrollBar = function(options) {
		this.name = 'dullScrollBar';
		this.version = '1.0';
		this.options = options;
		this.$element = null;
	};

	bdUI.dullScrollBar.defaults = {
		scrollWrap: '#scroll-wrap', //模拟滚动盒子
		scrollBox: '#scroll-box', //模拟滚动区域
		scrollTopBtn: '#scroll-top-btn', //点击向上滚动按钮
		scrollPor: '#scroll-por', //滚动条
		scrollPorBtn: '#scroll-por-btn', //滚动按钮
		scrollDownBtn: '#scroll-down-btn', //点击向下滚动按钮
		speed: 10 //点击滚动高度		
	};
	
	bdUI.dullScrollBar.prototype = {
		_init: function() {
			$scrollWrap = this.$element.find(this.options.scrollWrap); //模拟滚动盒子
			$scrollBox = this.$element.find(this.options.scrollBox); //模拟滚动区域
			$scrollTopBtn = this.$element.find(this.options.scrollTopBtn); //点击向上滚动
			$scrollPor = this.$element.find(this.options.scrollPor); //滚动条
			$scrollPorBtn = this.$element.find(this.options.scrollPorBtn); //滚动按钮
			$scrollDownBtn = this.$element.find(this.options.scrollDownBtn); //点击向下滚动
			this.speed = this.options.speed;
			this.scrollWrap = $scrollWrap.height(); //滚动盒子高度
			this.scrollBoxHei = $scrollBox.height(); //滚动区域高度
			this.scrollProHei = $scrollPor.height(); //滚动条高度
			this.scrollPorBtnHei = $scrollPorBtn.height(); //默认滚动按钮高度

			this.scrollHei = this.scrollBoxHei - this.scrollWrap; //默认允许滚动高度
			this.proHei = this.scrollProHei - this.scrollPorBtnHei; //默认允许滚动条高度
			this.itemMark = this.scrollHei / this.proHei; //滚动条高度相对允许滚动高度比

			this.porTopHei = $scrollPor.offset().top; //滚动条相对浏览器顶部高度
			$scrollPorBtn.css('height', this.scrollPorBtnHei / this.itemMark + 'px'); //重置滚动按钮高度
			this.scrollPorBtnHei = this.scrollPorBtnHei / this.itemMark; //重置后滚动按钮高度			
			this.proHei = this.scrollProHei - this.scrollPorBtnHei; //重置后允许滚动条高度

			this.flag = false;
			this.moveHei = 0;
            //允许滚动高度大于0
			if (this.scrollHei > 0) {				
				this.topBtn();
				this.downBtn();
				this.proBtn();
			}
		},
		auto: function() {
			//滚动按钮置顶时
			if (this.moveHei <= 0) {
				$scrollPorBtn.css('top', 0 + 'px');
				$scrollBox.css('top', 0 + 'px');
				this.moveHei = 0;
			} 
            //滚动按钮置低时
			else if (this.moveHei >= this.proHei) {
				$scrollPorBtn.css('top', this.proHei + 'px');
				$scrollBox.css('top', -this.scrollHei + 'px');
				this.moveHei = this.proHei;
			} else {
				$scrollPorBtn.css('top', this.moveHei + 'px');
				$scrollBox.css('top', -this.moveHei * this.itemMark + 'px');
			}
		},
		topBtn: function() {
			var _self = this,
				time;
			$scrollTopBtn.bind({
				'click': function() {
					_self.moveHei -= _self.speed;
					_self.auto();
				},
				//长按向上按钮执行定时器
				mousedown: function() {
					time = setInterval(function() {
						_self.moveHei -= _self.speed;
						_self.auto();
						//滚动到最顶部清除定时器
						if (_self.moveHei <= 0) {
							clearInterval(time);
						}
					}, 100)
				},
				mouseup: function() {
					clearInterval(time);
				}
			});
		},
		downBtn: function() {
			var _self = this,
				time;
			$scrollDownBtn.bind({
				'click': function() {
					_self.moveHei += _self.speed;
					_self.auto();
				},
				//长按向下按钮执行定时器
				mousedown: function() {
					time = setInterval(function() {
						_self.moveHei += _self.speed;
						_self.auto();
						//滚动到最低部清除定时器
						if (_self.moveHei >= _self.proHei) {
							clearInterval(time);
						}
					}, 100)
				},
				mouseup: function() {
					clearInterval(time);
				}
			});
		},
		proBtn: function() {
			var _self = this;


			$scrollPorBtn.bind({
				mousedown: function() {
					_self.flag = true;
				}
			});

			//取消ie选中文字
			document.onselectstart = function() {
				return false;
			};

			//兼容低级ie版本
			window.addEventListener = window.addEventListener ? window.addEventListener : window.attachEvent;

			//鼠标按下事件
			window.addEventListener('mouseup', function() {
				_self.flag = false;
			});

			//鼠标移动事件
			window.addEventListener('mousemove', function(evt) {
				evt.preventDefault;
				evt.onselectstart = "return false";
				if (_self.flag) {
					_self.moveHei = evt.pageY - _self.porTopHei;
					_self.auto();
				}
			});

			//火狐浏览器滚动鼠标中轴
			if (window.addEventListener) {

				this.$element[0].addEventListener('DOMMouseScroll', function(evt) {
					evt.detail > 0 ? _self.moveHei += _self.speed : _self.moveHei -= _self.speed;
					_self.auto();
				});
			}

			//其他浏览器滚动鼠标中轴
			this.$element[0].onmousewheel = function(evt) {
				evt.wheelDelta < 0 ? _self.moveHei += _self.speed : _self.moveHei -= _self.speed;
				_self.auto();
			};

		}
	};
})(jQuery);