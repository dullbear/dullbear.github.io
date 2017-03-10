/**
 * $.dullImgShow
 * @extends jquery.1.9.1
 * @author dullBear
 * @email dullbear.sheng@gmail.com
 * @site www.dullbear.com
 * @version 1.0
 * @date 2013-11-07
 * Copyright (c) 2013-2013 dullBear
 * @example   $(".main-pic-show").dullImgShow();
 */

;
(function($) {

	var bdUI = bdUI || {};
	$.fn.dullImgShow = function(options) {
		var pName = 'dullImgShow';
		var objData = $(this).data(pName);
		if (typeof objData == 'string' && objData == 'instance') {
			return objData;
		};
		var options = $.extend({}, bdUI.dullImgShow.defaults, options || {});
		return $(this).each(function() {
			var dullImgShow = new bdUI.dullImgShow(options);
			dullImgShow.$element = $(this);
			dullImgShow._init();
			$(this).data(pName, dullImgShow);
		});
	};

	bdUI.dullImgShow = function(options) {
		this.name = 'dullImgShow';
		this.version = '1.0';
		this.options = options;
		this.$element = null;
	};

	bdUI.dullImgShow.defaults = {
		//图片标题
		titleName: '#title-name',
		//当前序号
		currentSort: '#current-num',
		//总共张数
		sum: '.main-title-all',
		//图片展示盒子
		bigBox: '#big-ul',
		//大图下一张按钮
		bigNext: '#big-next',
		//大图上一张按钮
		bigPrev: '#big-prev',
		//缩略图滚动盒子
		smallBox: '#small-ul',
		//缩略图下一张按钮
		smallNext: '#small-next',
		//缩略图上一张按钮
		smallPrev: '#small-prev',
		//最后一张回调函数
		overcallback: null,
		//点击缩略图回调函数
		closedcallback: null
	};
	bdUI.dullImgShow.prototype = {
		_init: function() {
			//图片展示盒子
			this.$bigBox = $(this.options.bigBox);
			//图片展示宽度
			this.itemWidth = this.$bigBox.children().first().outerWidth(true);
			//图片展示个数
			this.len = this.$bigBox.children().length;

			this.i = 0;
			this.cun = 0;
			this.s = 0;

			//显示总共张数
			$(this.options.sum).html(this.len);
			//获取默认标题
			this.$titleName = $(this.options.titleName);
			this.currentTitleName = this.$titleName.html();
			//缩略图滚动盒子
			this.$smallBox = $(this.options.smallBox);
			//缩略图个数
			this.smallLen = this.$smallBox.children().length;
			//缩略图宽度
			this.smallItemWidth = this.$smallBox.children().first().outerWidth(true);
			//缩略图盒子装下图片个数
			this.$smallConLen = Math.ceil(this.$smallBox.parent().outerWidth() / this.smallItemWidth);
			//获取缩略图节点
			this.$smallConClick = this.$smallBox.children();
			//缩略图下一张按钮
			this.$smallNextBtn = $(this.options.smallNext);
			//缩略图上一张按钮
			this.$smallPrevBtn = $(this.options.smallPrev);
			console.log();
			//判断缩略图是否滚动			
			if (this.smallLen > this.$smallConLen) {
				this.smallNextBtn();
				this.smallPrevBtn();
			};

			//页面刷新停留在当前页
			this.current = location.hash.replace('#image', '');
			if (this.current == '') {
				this.cun = 0;
			} else {
				this.cun = parseInt(this.current);
			};
			this._default(this.cun, false);

			this.bigNextBtn();
			this.bigPrevBtn();
			this.smallConClick();

		},
		_default: function(index, bool) {
			//页面刷新停留在当前页
			location.href = location.pathname + '#image' + index;
			//获取当前图片序号
			var pic = this.$bigBox.find('img').eq(index);
			//获取当前图片属性
			var dataSrc = pic.attr('data-src');
			var attrSrc = pic.attr('src');
			var picAlt = pic.attr('alt');
			//显示当前图片序号
			$(this.options.currentSort).html(this.cun + 1);
			//显示当前图片标题
			if (typeof picAlt == 'undefined' || picAlt == '#' || picAlt == '') {
				this.$titleName.html(this.currentTitleName);
			} else {
				this.$titleName.html(picAlt);
			};
			//显示图片src
			if (dataSrc != attrSrc) {
				pic.attr('src', dataSrc);
			}
			var _self = this;
			//图片预加载
			(function getMeta(src) {
				var img = new Image();
				img.src = src;
				img.onload = function() {
					var height = this.height * (_self.itemWidth / this.width);
					if (this.width >= _self.itemWidth) {
						pic.css({
							'max-width': _self.itemWidth,
							'height': height
						});
						_self.$bigBox.css('height', _self.height);
					} else {
						pic.attr({
							'width': this.width,
							'height': this.height
						});
						_self.$bigBox.css('height', this.height);
					};


				};
			})(dataSrc);


			var scrollWidth = parseInt(-this.itemWidth * index);

			if (bool == false) {
				this.$bigBox.css('margin-left', scrollWidth + 'px');
			} else {
				this.$bigBox.stop().animate({
					'margin-left': scrollWidth + 'px'
				});
			}


		},
		bigNextBtn: function() {
			var _self = this;
			$(this.options.bigNext).bind({
				click: function() {
					if (_self.cun == _self.len - 1) {
						_self.callback('over');
						return false;
					};
					_self.cun += 1;
					_self._default(_self.cun);
				}
			});
		},
		bigPrevBtn: function() {
			var _self = this;
			$(this.options.bigPrev).bind({
				click: function() {
					if (_self.cun <= 0) {
						return false;
					};
					_self.cun -= 1;
					_self._default(_self.cun);
				}
			});
		},
		//缩略图点击
		smallConClick: function() {
			var _self = this;
			this.$smallConClick.bind({
				click: function() {
					var index = $(this).index();
					_self.cun = index;
					_self._default(index);
					_self.callback('closed');
				}
			});
		},
		//缩略图下一张
		smallNextBtn: function() {
			var _self = this;
			this.$smallNextBtn.bind({
				click: function() {
					_self.s -= 1;
					if (-_self.s > _self.$smallConLen) {
						_self.s = -_self.$smallConLen;
						return false;
					};
					_self.$smallBox.stop().animate({
						'margin-left': _self.s * _self.smallItemWidth + 'px'
					});

				}
			});
		},
		//缩略图上一张
		smallPrevBtn: function() {
			var _self = this;
			this.$smallPrevBtn.bind({
				click: function() {
					_self.s += 1;
					if (_self.s > 0) {
						_self.s = 0;
						return false;
					};
					_self.$smallBox.stop().animate({
						'margin-left': _self.s * _self.smallItemWidth + 'px'
					});

				}
			});
		},
		debug: function($message) {

			if (typeof $message == 'undefined') {
				$message = this;
			} else if (window.console.log && window.console) {
				window.console.log($message);
			} else {
				alert($message);
			};
		},

		callback: function(evt) {
			if (typeof this.options[evt + 'callback'] != 'function') {
				return false;
			} else {
				this.options[evt + 'callback'].call(this);
			};
		}
	};
})(jQuery);
