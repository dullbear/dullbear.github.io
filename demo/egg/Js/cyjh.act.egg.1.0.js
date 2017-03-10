/// <reference path="http://192.168.1.78:8080/VSReference/jquery/jquery.1.9.1.min-vsdoc.js" />
/// <reference path="http://192.168.1.78:8080/VSReference/cyjh/cyjh.1.3.3.js" />
/**
 * @name cyjh.act.egg
 * @constructor
 * @Extends jquery.1.9.1.min.js&cyjh.1.3.3.min.js&cyjh.act.1.3.0.min.js
 * @description 前端活动模板砸金蛋
 * @author dullBear (site: www.dullbear.com email:dullbear.sheng@gmail.com data:2015-03-17)
 * @version 1.0
 * @site www.dullbear.com
 * @example cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
 * cyjh.actEgg.eggHasPrize();
 * @param wrapIdName  {string} 金蛋外框id
 * @param evtIdName  {string} 事件点击层id
 * @param length {number} 金蛋个数
 * @param smashIdName {string} 锤子id
 */
/** @define {boolean} */
var JSCOMPRESS_DEBUG = true;
(function() {
	cyjh.act.egg = function(wrapIdName, evtIdName, length, smashIdName) {
		this.wrapIdName = $('#' + wrapIdName);
		this.smashIdName = $('#' + smashIdName);
		this.evtIdName = $('#' + evtIdName);
		this.length = length;
		this.init();
	};
	cyjh.act.egg.prototype = {
		/**
		 * @description 初始化插件金蛋个数 位置 锤子移动 点击事件
		 * @type function
		 * @example cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
		 * cyjh.actEgg.init();
		 */
		init: function() {
			var that = this,
				startHtml = '',
				endHtml = '',
				evtStartHtml = '',
				evtEndHtml = '';

			startHtml = '<li><i class="smashEggBody ">金蛋</i> <i class="smashEggFlower">花</i><i class="smashEggPack">礼包</i>\
				         <i class="smashEggBroken">砸开蛋</i></li>';
			evtStartHtml = '<li></li>';

			for (var i = 0; i <= this.length - 1; i++) {
				endHtml += startHtml;
				evtEndHtml += evtStartHtml;
			}
			this.wrapIdName.append(endHtml);
			this.evtIdName.append(evtEndHtml);

			//锤子移动
			this.evtIdName.mouseenter(function(e) {
				that.smashIdName.css({
					'display': 'block',
					'z-index': '98'
				});
			}).mouseleave(function() {
				that.smashIdName.css({
					'display': 'none',
					'z-index': '10'
				});
			}).mousemove(function(e) {
				var xParent=$(".smashEggWrap").offset().left;
				var yParent=$(".smashEggWrap").offset().top;

				that.smashIdName.css({
				"left":e.pageX -xParent + "px",
					"top": e.pageY -yParent -40 + "px"
				});
			});

			this.evtIdName.children('li').click(function(e) {
				var index = $(this).index();
				that.clickAllow(index);
			});
		},
		/**
		 * @description 回置金蛋、锤子为初始状态
		 * @type funtion
		 * @example cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
		 * cyjh.actEgg.reState();
		 */
		reState: function() {
			this.wrapIdName.children('li').removeClass('eggNoPrize eggHasPrize ');
			this.smashIdName.removeClass('smashEggHammerClick');
			this.smashIdName.css({
				'display': 'block',
				'z-index': '10'
			});
		},
		/**
		 * @description 有奖金蛋打开效果
		 * @type function
		 * @example cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
		 * cyjh.actEgg.eggNoPrize(index,function(){console.log('我的事件回调')};
		 * @param index {number}  那个金蛋执行动作
		 * @param callBack {function}  金蛋有奖回调事件
		 */
		eggHasPrize: function(index, callBack) {

			var that = this,
				time, time1;
			this.smashIdName.addClass('smashEggHammerClick');
			this.wrapIdName.children('li').eq(index).addClass('eggHasPrize');
			clearTimeout(time);
			clearTimeout(time1);
			time = setTimeout(function() {
				that.smashIdName.css('display', 'none');
				that = null;
			}, 300);
			time1 = setTimeout(function() {
				callBack();
				callBack = null;
			}, 1000);
		},
		/**
		 * @description 无奖金蛋打开效果
		 * @type function
		 * @example cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
		 * cyjh.actEgg.eggNoPrize(index,function(){console.log('我的事件回调')};
		 * @param index {number}  那个金蛋执行动作
		 * @param callBack {function} 金蛋无奖回调事件
		 */
		eggNoPrize: function(index, callBack) {
			var that = this,
				time, time1;
			this.smashIdName.addClass('smashEggHammerClick');
			this.wrapIdName.children('li').eq(index).addClass('eggNoPrize');
			clearTimeout(time);
			clearTimeout(time1);
			time = setTimeout(function() {
				that.smashIdName.css('display', 'none');
				that = null;
			}, 300);
			time1 = setTimeout(function() {
				callBack();
				callBack = null;
			}, 1000);

		},
		/**
		 * @description 锤子点击执行条件
		 * @type function
		 * @example cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
		 * cyjh.actEgg.clickAllow(index);
		 * @param index {number} 哪个金蛋执行打开动画
		 */
		clickAllow: function(index) {}
	};
})();