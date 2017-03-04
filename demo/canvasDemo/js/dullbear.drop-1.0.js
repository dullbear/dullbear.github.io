(function() {

	dullBear.fileInput = function() {
		if (!FileReader) {
			alert('你的浏览器不支持');
		} else {
			this.init();
		}
	};

	dullBear.fileInput.prototype = {
		init: function() {
			var fileInt = document.querySelector('#fileInt'),
				html = "";
		},
		getFileProperty: function(e, sucCallBack, errCallBack) {
			var file = e.files[0],
				reader = new FileReader(), //实例化FileReader 获取它自身属性
				typeReg = /image.*/;
			//判断文件否是图片
			if (typeReg.test(file.type)) {
				//获取图片base64
				reader.readAsDataURL(file);
				reader.onload = function() {
					sucCallBack({
						"type": file.type, //图片类型
						"name": file.name, //图片名称
						"size": file.size, //图片大小
						"base64": this.result //图片base4
					});
				};

				reader.error = function() {
					errCallBack('加载错误');
				};
			};

		}
	};

})();

var file = new dullBear.fileInput();

document.querySelector('#fileInt').addEventListener('change', function(e) {
	var that = this;
	file.getFileProperty(that, function(attr) {
		/*var Canvas = new dullBear.Canvas('myCanvas');
		console.log(attr);*/
		Canvas.drawClear();
		Canvas.drawImg(attr.base64,  0, 0, 320, 640);
	}, function(errorTip) {
		console.log(errorTip);
	});
}, false);