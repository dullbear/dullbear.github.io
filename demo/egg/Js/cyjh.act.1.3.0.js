/*┏┓　　　┏┓
┏┛┻━━━┛┻┓
┃　　　　　　　┃    ***** JavaScript Document
┃　　　━　　　┃    ***** 宅小歪 活动专题基础类
┃　┳┛　┗┳　┃    ***** 2013-10-29  Update 2015-2-12
┃　　　　　　　┃
┃　　　┻　　　┃
┃　　　　　　　┃
┗━┓　　　┏━┛
    ┃　　　┃  神兽保佑
    ┃　　　┃  代码无BUG！
    ┃　　　┗━━━┓
    ┃　　　　　　　┣┓
    ┃　　　　　　　┏┛
    ┗┓┓┏━┳┓┏┛
      ┃┫┫　┃┫┫
      ┗┻┛　┗┻┛    */
/// <reference path="http://192.168.1.78:8080/VSReference/jquery/jquery.1.9.1.min-vsdoc.js">
/// <reference path="http://192.168.1.78:8080/VSReference/cyjh/cyjh.1.3.3.js">
(function ($) {
	/// <summary>
	/// 活动页
	/// </summary>
	/// <param type="jQuery" name="$">jQuery
	if (typeof cyjh!=="object") {
		throw "请先引用cyjh基础库";
		return;
	}
	if (typeof cyjh.act === "object") return;
	var Act = function () {
		/// <summary>
		///	活动模块
		/// </summary>
		/// <field type="Boolean" name="_isLogin">(内部属性)是否已登录</field>
		/// <field type="Object" name="UserState">状态值（调用IsLogin设置的状态值，存储用户名、邮箱等附加信息）</field>
		/// <field type="Array" elementtype="Function" name="_postState">(内部属性)需要推送登录状态的所有回调方法集合</field>
		this._isLogin = false;
		this.UserState = undefined;
		this._postState = []
	};
	//活动状态
	var actStateEnum = {
		/// <field type="Number" name="Normal">活动正常</field>
		Normal: 0,
		/// <field type="Number" name="NotStart">活动尚未开始</field>
		NotStart: 1,
		/// <field type="Number" name="Expired">活动已过期</field>
		Expired: 2
	};
	//数据提交

	///<var>所有提交请求数据的集合</var>
	var getDataObj = {};
	var Ajax = function (sessionid, url, method, data, callbackDataType, succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback) {
		/// <summary>使用Ajax发送Get/Post请求</summary>
		/// <param name="sessionid" type="String">提交标识，若相同切上一次请求还未结束则会中断上一次请求
		/// <param name="url" type="String">请求的网址
		/// <param name="method" type="String">请求方式 get / post
		/// <param name="callbackDataType" type="String">请求的返回值类型 text json html script
		/// <param name="data" type="Object">推送给服务端的数据{"name":"value"}
		/// <param name="succCallback" type="Function">请求正常时引发，以下返回值属于正常：
		/// &#10; 服务端JSON数据最外层有返回字段ActState并且等于0  -->{"ActState":0}；
		/// &#10; 服务端JSON数据最外层没有包含字段ActState。
		///&#10; succCallback(result);
		///
		/// <param name="timeout" type="Number" value="1">超时时间（秒），若为0表示不检测超时
		/// <param name="timeoutCallback" type="Function">请求时间超过timeout秒时引发  timeoutCallback()
		/// <param name="actNotStartCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于1  -->{"ActState":1} 时引发   actNotStartCallback(result)
		/// <param name="actExpiredCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于2  -->{"ActState":2} 时引发     actExpiredCallback(result)
		/// <param name="failedCallback" type="Function">请求失败时引发（网络问题、返回值与callbackDataType格式不匹配等） failedCallback(xhr, errmsg)
		/// <field name="IsDisposed" type="Boolean">是否已被释放</field>
		if (typeof sessionid !== "string" || sessionid.length === 0) throw "sessionid必须是string (at) " + arguments.callee.caller;
		if (typeof timeout !== "number") throw "timeout必须是number,不考虑超时请填0 (at) " + arguments.callee.caller;
		if (getDataObj[sessionid]) {
			//移除旧数据
			getDataObj[sessionid].Abort();
		}
		var T = this;
		this._sessionid = sessionid;
		this._timeoutHandle = null;
		this._succCallback = succCallback;
		this._actNotStartCallback = actNotStartCallback;
		this._actExpiredCallback = actExpiredCallback;
		this._failedCallback = failedCallback;
		this.IsDisposed = false;
		this._ajaxObj = $.ajax(url, {
			type: method,
			dataType: callbackDataType,
			data: data,
			success: function (result) {
				/// <param name="result" type="Object" value="{ActState:0}">服务端返回值
				if (cyjh.data.isObject(result) && typeof result.ActState === "number") {
					switch (result.ActState) {
						case actStateEnum.NotStart: {
							T._actNotStartCallback && T._actNotStartCallback.call(window, result);
							T._dispose();
							T = null;
							break;
						}
						case actStateEnum.Expired: {
							T._actExpiredCallback && T._actExpiredCallback.call(window, result);
							T._dispose();
							T = null;
							break;
						}
						default: {
							T._succCallback && T._succCallback.call(window, result);
							T._dispose();
							T = null;
						}
					}
				} else {
					T._succCallback && T._succCallback.call(window, result);
					T._dispose();
					T = null;
				}
			},
			error: function (xhr, errmsg) {
				if (xhr.status === 0 || xhr.status === 12029 || xhr.status === 12027 || xhr.readyState === 0 || xhr.statusText === 'abort') {
					T._dispose();
					T = null;
					return;
				}
				T._failedCallback && T._failedCallback.call(xhr, errmsg);
				T._dispose();
				T = null;
			}
		});
		getDataObj[sessionid] = this;
		if (timeout > 0) {
			this._timeoutCallback = timeoutCallback;
			this._timeoutHandle = window.setTimeout(function () {
				T._timeoutCallback && T._timeoutCallback.call(window);
				T.Abort();
				T = null;
			}, timeout * 1000);
		};
	};
	Ajax.prototype._dispose = function () {
		/// <summary>释放数据</summary>
		if (this.IsDisposed) return;
		if (this._sessionid && getDataObj[this._sessionid]) {
			delete getDataObj[this._sessionid];
		}
		delete this._sessionid;
		delete this._ajaxObj;
		typeof this._timeoutHandle === "number" && window.clearTimeout(this._timeoutHandle);
		delete this._timeoutHandle;
		delete this._succCallback;
		delete this._actNotStartCallback;
		delete this._actExpiredCallback;
		delete this._failedCallback;
		delete this._timeoutCallback;
		this.IsDisposed = true;
	};
	Ajax.prototype.Abort = function () {
		/// <summary>中止请求并释放资源</summary>
		if (this._ajaxObj) {
			this._ajaxObj.abort();
			delete this._ajaxObj;
		}
		this._dispose();
	};
	Act.prototype.GetJSON = function (sessionid, url, data, isCallbackJSON, succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback) {
		/// <summary>使用Ajax发送Get请求</summary>
		/// <param name="sessionid" type="String">提交标识，若相同切上一次请求还未结束则会中断上一次请求
		/// <param name="url" type="String">请求的网址
		/// <param name="data" type="Object">推送给服务端的数据{"name":"value"}
		/// <param name="isCallbackJSON" type="Boolean">返回值是否是json
		/// <param name="succCallback" type="Function">请求正常时引发，以下返回值属于正常：
		/// &#10; 服务端JSON数据最外层有返回字段ActState并且等于0  -->{"ActState":0}；
		/// &#10; 服务端JSON数据最外层没有包含字段ActState。
		///&#10; succCallback(result);
		///
		/// <param name="timeout" type="Number" value="1">超时时间（秒），若为0表示不检测超时
		/// <param name="timeoutCallback" type="Function">请求时间超过timeout秒时引发  timeoutCallback()
		/// <param name="actNotStartCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于1  -->{"ActState":1} 时引发   actNotStartCallback(result)
		/// <param name="actExpiredCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于2  -->{"ActState":2} 时引发     actExpiredCallback(result)
		/// <param name="failedCallback" type="Function">请求失败时引发（网络问题、返回值与isCallbackJSON格式不匹配等） failedCallback(xhr, errmsg)
		/// <returns type="Ajax">
		return new Ajax(sessionid, url, "get", data, isCallbackJSON ? "json" : "text", succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback);
	};
	Act.prototype.PostJSON = function (sessionid, url, data, isCallbackJSON, succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback) {
		/// <summary>使用Ajax发送Post请求</summary>
		/// <param name="sessionid" type="String">提交标识，若相同切上一次请求还未结束则会中断上一次请求
		/// <param name="url" type="String">请求的网址
		/// <param name="data" type="Object">推送给服务端的数据{"name":"value"}
		/// <param name="isCallbackJSON" type="Boolean">返回值是否是json
		/// <param name="succCallback" type="Function">请求正常时引发，以下返回值属于正常：
		/// &#10; 服务端JSON数据最外层有返回字段ActState并且等于0  -->{"ActState":0}；
		/// &#10; 服务端JSON数据最外层没有包含字段ActState。
		///&#10; succCallback(result);
		///
		/// <param name="timeout" type="Number" value="1">超时时间（秒），若为0表示不检测超时
		/// <param name="timeoutCallback" type="Function">请求时间超过timeout秒时引发  timeoutCallback()
		/// <param name="actNotStartCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于1  -->{"ActState":1} 时引发   actNotStartCallback(result)
		/// <param name="actExpiredCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于2  -->{"ActState":2} 时引发     actExpiredCallback(result)
		/// <param name="failedCallback" type="Function">请求失败时引发（网络问题、返回值与isCallbackJSON格式不匹配等） failedCallback(xhr, errmsg)
		/// <returns type="Ajax">
		return new Ajax(sessionid, url, "post", data, isCallbackJSON ? "json" : "text", succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback);
	};
	Act.prototype.GetJSONP = function (sessionid, url, data, succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback) {
		/// <summary>(不适用Ajax的环境，如跨域)</summary>
		/// <param name="sessionid" type="String">提交标识，若相同切上一次请求还未结束则会中断上一次请求
		/// <param name="url" type="String">请求的网址
		/// <param name="data" type="Object">推送给服务端的数据{"name":"value"}
		/// <param name="succCallback" type="Function">请求正常时引发，以下返回值属于正常：
		/// &#10; 服务端JSON数据最外层有返回字段ActState并且等于0  -->{"ActState":0}；
		/// &#10; 服务端JSON数据最外层没有包含字段ActState。
		///&#10; succCallback(result);
		///
		/// <param name="timeout" type="Number" value="1">超时时间（秒），若为0表示不检测超时
		/// <param name="timeoutCallback" type="Function">请求时间超过timeout秒时引发  timeoutCallback()
		/// <param name="actNotStartCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于1  -->{"ActState":1} 时引发   actNotStartCallback(result)
		/// <param name="actExpiredCallback" type="Function">服务端JSON数据最外层有返回字段ActState并且等于2  -->{"ActState":2} 时引发     actExpiredCallback(result)
		/// <param name="failedCallback" type="Function">请求失败时引发（网络问题、返回值异常） failedCallback(xhr, errmsg)
		/// <returns type="Ajax">
		return new Ajax(sessionid, url, "get", data, "jsonp", succCallback, timeout, timeoutCallback, actNotStartCallback, actExpiredCallback, failedCallback);
	};


	//用户相关
	Act.prototype.IsLogin = function () {
		/// <signature>
		/// <summary>设置登录状态</summary>
		/// <param name="value" type="Boolean">新的登录状态
		/// <param name="state" type="Object">状态值（可以任意值，根据需要设置）,将会分发回调到所有AddUserStateHandler的插件
		/// </signature>
		/// <signature>
		/// <summary>获取当前登录状态</summary>
		/// <returns type="Boolean">
		/// </returns></signature>
		var len = arguments.length;
		if ((len === 1 || len === 2) && typeof arguments[0] === "boolean") {
			var value = arguments[0];
			var oldUS = this.UserState;
			this.UserState = (value && (len === 2)) ? arguments[1] : undefined;
			if (this._isLogin != value || (oldUS !== this.UserState)) {
				//只简单判断新旧UserState是否一致 不判断当UserState为object或array时子集是否一致的情况
				this._isLogin = value;
				for (var f in this._postState) {
					//通知所有注册的回调事件
					var fun1 = this._postState[f];
					typeof fun1 === "function" && fun1.call(window, value, this.UserState);
				}
			}
		} else {
			return this._isLogin;
		}
	};
	Act.prototype.CheckLogin = function () {
		/// <summary>检测是否登录，若未登录将主动调用OpenLoginForm</summary>
		/// <returns type="Boolean">是否已登录</returns>
		if (this._isLogin) return true;
		else {
			this.OpenLoginForm();
			return false;
		}
	};
	Act.prototype.AddUserStateHandler = function (callback) {
		/// <summary>注册监听用户状态变更回调(注册完就会推送一次)</summary>
		/// <param name="callback" type="Function">回调方法 callback(是否登录Boolean isLogin,状态值Object UserState)
		if (typeof callback !== "function") return;
		for (var f in this._postState) {
			if (this._postState[f] === callback) return;//已注册过
		}
		this._postState.push(callback);
		callback.call(window, this._isLogin, this.UserState);
	};
	Act.prototype.RemoveUserStateHandler = function (callback) {
		/// <summary>注销监听用户状态变更回调</summary>
		/// <returns type="Boolean">
		if (typeof callback !== "function") return false;
		var index = -1;
		for (var f in this._postState) {
			if (this._postState[f] === callback) {
				index = f;
				break;
			}
		}
		if (index != -1) {
			this._postState.splice(index, 1);
			return true;
		}
		return false;
	};
	Act.prototype.OpenLoginForm = function () {
		/// <summary>(请重载方法)调用登录方法</summary>
	};
	cyjh.act = new Act();
	/*
		弹窗部分
	*/
	var createStyleCss = function (list) {
		/// <summary>插入样式表</summary>
		/// <param name="list" type="String[][]">样式列表[["name","value"],["name","value"]]
		var head = document.getElementsByTagName("head");
		if (head.length > 0) {
			head = head[0];
			var ele = document.createElement("style");
			ele.setAttribute("type", "text/css");
			if (head.firstChild == null) {
				head.appendChild(ele);
			} else {
				head.insertBefore(ele, head.firstChild);
			}
			ele = document.styleSheets[0];
			if (ele.cssRules != null && ele.insertRule != null) {
				for (var x in list) {
					var rule = list[x];
					rule = rule[0] + "{" + rule[1] + "}";
					ele.insertRule(rule, ele.cssRules.length);
				}
			} else if (ele.addRule != null) {
				for (var x in list) {
					var rule = list[x];
					ele.addRule(rule[0], rule[1], -1);
				}
			}
		}
		head = list = ele = null;
	};
	(function () {
		/// <summary>
		///	弹窗扩展
		/// </summary>

		var cssList = [];
		//loading部分
		
		//通用部分
		if (cyjh.browser.isie6) {
			//ie6兼容
			cssList.push(
				["body", "background-image:url('about:blank'); background-attachment:fixed"],
				[".filterIE6BG___", "position:absolute;top:expression(eval(document.documentElement.scrollTop));"]
			);
		}
		cssList.length!==0 && createStyleCss(cssList);
		cssList = null;		
		(function () {
			/// <summary>
			///	内容弹窗
			/// </summary>
			var _PopBoxNextID = 1;
			var _PopBoxZIndex = 39999;
			var getNextZIndex = function () {
				/// <summary>获取最新层级</summary>
				_PopBoxZIndex += 2;
				return _PopBoxZIndex;
			};
			var getPopBoxNextID = function () {
				/// <summary>获取弹窗主体自增长id</summary>
				/// <returns type="String">
				return "__PopboxAutoId" + _PopBoxNextID++;
			};
			///<var>所有的未关闭的弹窗集合</var>
			var popBoxData = {};
			var btnCloseClick = function () {
				var T = $(this);
				var pop = T.data("data-pop");
				if (cyjh.data.isObject(pop)) {
					for (var popId in pop) {
						var box = pop[popId];
						//var result = true;
						typeof box.onCloseCallback === "function" && (box.onCloseCallback.call(window, box.onCloseCallbackState));
					//	if (result !== false) {
						box.Close();
						box = undefined;
					//	}
					}
				}
				T.removeData("data-pop").unbind("click",arguments.callee);
			}
			var PopBox = function (boxSelector, btnCloseSelector, onCloseCallback, onCloseCallbackState, bgColor, bgOpacity) {
				/// <summary>弹窗</summary>
				/// <param name="boxSelector" type="String">弹窗正文的jq筛选器
				/// <param name="btnCloseSelector" type="String">关闭弹窗的按钮的jq筛选器
				/// <param name="onCloseCallback" type="Function">按下关闭按钮关闭弹窗后的回调方法（调用.Close不会触发） onCloseCallback(@onCloseCallbackState)
				/// <param name="onCloseCallbackState" type="Object">onCloseCallback触发时传递的参数
				/// <param name="bgColor" type="String">弹窗背景遮罩层背景色（#000）
				/// <param name="bgOpacity" type="Number">遮罩层透明度，0-100
				/// <field name="IsClosed" type="Boolean">弹窗是否已经被关闭并释放</field>
				/// <field name="_popId" type="String">遮罩层id（若有）</field>
				/// <field name="_box" type="jQuery">boxSelector对应的jq对象</field>
				/// <field name="onCloseCallback" type="Function">按下关闭按钮关闭弹窗后的回调方法（调用.Close不会触发） onCloseCallback(@onCloseCallbackState)</field>
				/// <field name="onCloseCallbackState" type="Object">onCloseCallback触发时传递的参数</field>
				/// <field name="_resize" type="Function">ie6-8兼容的resize事件，内部使用</field>
				var box = $(boxSelector);				
				if (box.length == 0) {
					this.IsClosed = true;
					return;
				}
				this.IsClosed = false;
				var btnClose = $(btnCloseSelector);
				!cyjh.data.isNotEmptyStr(bgColor) && (bgColor = "#000");
				(typeof bgOpacity !== "number" || bgOpacity < 0 || bgOpacity > 100) && (bgOpacity = 90);
				//
				var zindex = getNextZIndex();
				var popId = box.attr("data-popid") || getPopBoxNextID();
				var dataPop = btnClose.data("data-pop") || {};
				dataPop[popId] = this;
				this._popId = popId;
				this._box = box;
				this.onCloseCallback = onCloseCallback;
				this.onCloseCallbackState = onCloseCallbackState;
				btnClose.unbind("click", btnCloseClick).bind("click", btnCloseClick).data("data-pop", dataPop);
				if (bgOpacity > 0) {
					//需要遮罩背景层
					var div;
					div = $("#" + popId);
					if (div.length===0) {
						div = $(document.createElement("div"));
						div.appendTo(document.body);
					}
					div.prop("id", popId);
					if (cyjh.browser.isie6) {
						div.addClass("filterIE6BG___");
						div.css({ top: 0, left: 0, width: "100%", height: "100%", opacity: bgOpacity / 100, backgroundColor: bgColor, display: "block", "z-index": zindex });
					} else {
						div.css({ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", opacity: bgOpacity / 100, backgroundColor: bgColor, display: "block", "z-index": zindex });
					}
				
				}
				box.attr("data-popid", popId);
				if (window.addEventListener) {
					box.css({ position: "fixed", top: "-10000px", left: "-10000px", display: "block", "z-index": zindex+1 });
					box.css({top:"calc((100% - "+ box.height() +"px) / 2)",left:"calc((100% - "+ box.width() +"px) / 2)"});
				} else if (!cyjh.browser.isie6) {
					//ie7-8
					box.css({ position: "fixed", top: "-10000px", left: "-10000px", display: "block", "z-index": zindex + 1 });
					this._resize = function () {
						var callee=arguments.callee;
						var boxer = callee.boxer;
						var $w = $(window);
						if (boxer && boxer._box) {
							boxer._box.css({ top: ($w.height() - box.height()) / 2, left: ($w.width() - box.width()) / 2 });
						} else {
							//自我注销
							$w.unbind("resize", callee);
						}
						$w = null;
					};
					this._resize.boxer = this;
					$(window).bind("resize", this._resize);
					this._resize();
				} else {
					//ie6
					box.css({ position: "absolute", top: "-10000px", left: "-10000px", display: "block", "z-index": zindex + 1 });
					this._resize = function () {
						var callee = arguments.callee;
						var boxer = callee.boxer;
						var $w = $(window);
						if (boxer && boxer._box) {
							boxer._box.css({ top: document.documentElement.scrollTop + ($w.height() - box.height()) / 2, left: document.documentElement.scrollLeft + ($w.width() - box.width()) / 2 });
							if (cyjh.browser.isie6) {
								$("#" + boxer._popId).height($w.height());
							}
						} else {
							//自我注销
							$w.unbind("resize", callee);
						}
						$w = null;
					};
					this._resize.boxer = this;
					$(window).bind("resize", this._resize);
					$(window).bind("scroll", this._resize);
					this._resize();
				}
			};
			PopBox.prototype.Close = function () {
				/// <summary>关闭该弹窗（不触发onCloseCallback）</summary>
				if (this.IsClosed || !this._box) return;
				$("#" + this._popId).hide();
				this._box.hide();
				delete this._box;
				delete this._popId;
				delete this.onCloseCallback;
				delete this.onCloseCallbackState;
				if (this._resize) {
					delete this._resize.boxer;
					if (cyjh.browser.isie6) {
						$(window).unbind("resize", this._resize).unbind("scroll", this._resize);
					} else {
						$(window).unbind("resize", this._resize);
					}
				
					delete this._resize;
				}
				this.IsClosed = true;
			};
			Act.prototype.PopBox = function (boxSelector, btnCloseSelector, onCloseCallback, onCloseCallbackState, bgColor, bgOpacity) {
				/// <summary>弹窗</summary>
				/// <param name="boxSelector" type="String">弹窗正文的jq筛选器
				/// <param name="btnCloseSelector" type="String">关闭弹窗的按钮的jq筛选器
				/// <param name="onCloseCallback" type="Function">按下关闭按钮关闭弹窗后的回调方法（调用.Close不会触发） onCloseCallback(@onCloseCallbackState)
				/// <param name="onCloseCallbackState" type="Object">onCloseCallback触发时传递的参数
				/// <param name="bgColor" type="String">弹窗背景遮罩层背景色（#000）
				/// <param name="bgOpacity" type="Number">遮罩层透明度，0-100
				///<returns type="PopBox">
				return new PopBox(boxSelector, btnCloseSelector, onCloseCallback, onCloseCallbackState, bgColor, bgOpacity);
			};
		})();
	})();
})(jQuery);</returns></returns></returns></returns></returns></returns></reference></reference>