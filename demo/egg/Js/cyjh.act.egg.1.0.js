/// <reference path="http://192.168.1.78:8080/VSReference/jquery/jquery.1.9.1.min-vsdoc.js">
/// <reference path="http://192.168.1.78:8080/VSReference/cyjh/cyjh.1.3.3.js">
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

			for (var i = 0; i </reference></reference>