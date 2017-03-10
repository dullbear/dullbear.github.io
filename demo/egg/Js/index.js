/// <reference path="http://192.168.1.78:8080/VSReference/jquery/jquery.1.9.1.min-vsdoc.js" />
/// <reference path="http://192.168.1.78:8080/VSReference/cyjh/cyjh.1.3.3.js" />
/// <reference path="http://192.168.1.78:8080/VSReference/cyjh.act/cyjh.act.1.3.0.js" />
/// <reference path="cyjh.act.egg.1.0.js" />
(function() {

	cyjh.actEgg = new cyjh.act.egg('smashEggWrap', 'evtEgg', 3, 'smashEggHammer');
	var prize = 1;
	cyjh.actEgg.clickAllow = function(index) {
		if (!cyjh.act.IsLogin()) {
			alert('请登录');
			cyjh.act.IsLogin(true, {
				"userName": "dullbear"
			});
		} else {
			var num = parseInt(Math.random() * 4) + 1,
				url = "Data/prizeInfo" + num + ".txt";
			cyjh.act.GetJSON("getPrizeInfo", url, null, true, function(json) {
				if (!jQuery.isEmptyObject(json)) {
					var prizeInfo = json.prizeInfo;
					if (!jQuery.isEmptyObject(prizeInfo)) {
						if (prizeInfo.isPrize == true) {
							cyjh.actEgg.eggHasPrize(index, function() {
								cyjh.actEgg.reState();
								alert('恭喜你获得咯：' + prizeInfo.prizeName);
							});
						} else {
							cyjh.actEgg.eggNoPrize(index, function() {
								cyjh.actEgg.reState();
								alert('谢谢参与！');
							});
						}
					}
				}
			}, 60, function() {
				alert('请求超时');
			}, function() {
				alert('活动未开始！');
			}, function() {
				alert('活动已过期！');
			}, function() {
				alert('请求失败！');
			});
		}
	};

})();