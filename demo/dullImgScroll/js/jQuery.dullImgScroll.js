/**
 * $.dullImgScroll
 * @extends jquery.1.9.1
 * @author dullBear
 * @email dullbear.sheng@gmail.com
 * @site www.dullbear.com
 * @version 1.1
 * @date 2013-11-05
 * Copyright (c) 2013-2013 dullBear
 * @example   $("#scrollWrap").dullImgScroll();
 */

(function($) {
    //命名空间
    var dbUI = dbUI || {};

    $.fn.dullImgScroll = function(options) {
        /*默认参数*/
        var defaults = {
            //用户获取滚动外层高宽以判断是否满足滚动条件
            scrollBox: '#scrollBox',
            //滚动内容
            boxName: '#scrollBox',
            //下一帧按钮
            nextBtn: '#nextBtn',
            //上一帧按钮
            prevBtn: '#prevBtn',
            //滚动方向
            direction: 'left',
            //当前滚动页面
            current: 0,
            //当前显示状态小图
            currentBox: ".currentBtn",
            //滚动个数
            cun: 1,
            //滚动速度
            speed: 2000
        };

        var PNAME = 'dullImgScroll';

        var objData = $(this).data(PNAME);

        //get instance object
        if (typeof options == 'string' && options == 'instance') {
            return objData;
        }

        var options = $.extend({}, defaults, options || {});

        return $(this).each(function() {
            var dullImgScroll = new dbUI.dullImgScroll(options);

            dullImgScroll.$element = $(this);

            dullImgScroll._init();
        });
    };

    dbUI.dullImgScroll = function(options) {
        this.name = 'dullImgScroll';
        this.version = 1.0;
        this.options = options;
    };

    dbUI.dullImgScroll.prototype = {
        _init: function() {

            this.$scrollBox = this.$element.find(this.options.scrollBox);
            this.$box = this.$element.find(this.options.boxName);
            this.len = this.$box.children().length;
            //获取单个项目的宽度
            this.itemWidth = this.$box.children().first().outerWidth(true);
            //获取单个项目的高度
            this.itemHeight = this.$box.children().first().outerHeight(true);
            //查找按钮
            this.$nextBtn = this.$element.find(this.options.nextBtn);
            this.$prevBtn = this.$element.find(this.options.prevBtn);

            this.$currentBox = this.$element.find(this.options.currentBox);
            this.direction = this.options.direction;
            this.cun = this.options.cun;
            this.i = 0;
            this.current = this.options.current;
            this.page = Math.ceil(this.len / this.cun);

            //判断是否向左滚动
            if (this.direction == 'left') {
                if (this.$scrollBox.width() / this.itemWidth < this.len) {
                    //复制追加两个到尾部
                    this.$box.append(this.$box.children().clone());
                    this.$box.append(this.$box.children().clone());
                    this.auto();
                    this.evt();
                    this.clear();
                }
            }

            //判断是否向上滚动
            else if (this.direction == 'top') {
                if (Math.ceil(this.$scrollBox.height() / this.itemHeight) < this.len) {
                    //复制追加两个到尾部
                    this.$box.append(this.$box.children().clone());
                    this.$box.append(this.$box.children().clone());
                    this.auto();
                    this.evt();
                    this.clear();
                }
            };
        },
        defaults: function() {
            //向左滚动
            if (this.direction == 'left') {

                this.current += 1;
                //当滚动宽度大于等于总宽度                  
                if (this.current > this.page) {
                    this.$box.css('margin-left', 0);
                    this.current = 1;
                }
                this.$box.stop().animate({
                    'margin-left': -this.itemWidth * this.current * this.cun + 'px'
                });
                this.currentBtn();
            }
            //向上滚动
            if (this.direction == 'top') {
                this.current += 1;
                //当滚动宽度大于等于总宽度                  
                if (this.current > this.page) {
                    this.$box.css('margin-top', 0);
                    this.current = 1;
                }
                this.$box.stop().animate({
                    'margin-top': -this.itemHeight * this.current * this.cun + 'px'
                });
                this.currentBtn();
            }
        },
        auto: function() {
            var _self = this;
            this.time = setInterval(function() {
                _self.defaults();
            }, this.options.speed);

        },
        currentBtn: function() {
            var currentBtnPic = this.$currentBox.children();
            this.current == 2 ? index = 0 : index = this.current;
            currentBtnPic.eq(index).addClass('current').siblings().removeClass('current');
        },
        evt: function() {
            var _self = this;
            var currentBtnPic = this.$currentBox.children();
            //状态按钮
            currentBtnPic.bind({
                'click': function() {
                    var index = $(this).index();
                    $(this).addClass('current').siblings().removeClass('current');

                    if (_self.direction == 'left') {
                        _self.$box.stop().animate({
                            'margin-left': -_self.itemWidth * index * _self.cun + 'px'
                        });
                        _self.current = index;
                    } else if (_self.direction == 'top') {
                        _self.$box.stop().animate({
                            'margin-left': -_self.itemHeight * index * _self.cun + 'px'
                        });
                        _self.current = index;
                    };

                }
            });
            //点击下一个按钮

            this.$nextBtn.bind({
                click: function() {
                    _self.defaults();
                }
            });

            //点击上一个按钮
            this.$prevBtn.bind({
                click: function() {
                    //向左滚动
                    if (_self.direction == 'left') {
                        var locationWidth = _self.page * _self.itemWidth * _self.cun;
                        _self.current -= 1;
                        //当滚动宽度大于等于总宽度  

                        if (_self.current < 0) {
                            _self.$box.css('margin-left', -locationWidth + 'px');
                            _self.current = _self.page - 1;
                        };
                        _self.$box.stop().animate({
                            'margin-left': -_self.itemWidth * _self.current * _self.cun + 'px'
                        });
                        _self.currentBtn();

                    };
                    //向上滚动
                    if (_self.direction == 'top') {
                        _self.current -= 1;
                        var locationHeight = _self.page * _self.itemHeight * _self.cun;
                        //当滚动宽度大于等于总宽度                  
                        if (_self.current < 0) {
                            _self.$box.css('margin-top', -locationHeight + 'px');
                            _self.current = _self.page - 1;
                        };
                        _self.$box.stop().animate({
                            'margin-top': -_self.itemHeight * _self.current * _self.cun + 'px'
                        });

                        _self.currentBtn();
                    };
                }
            });


        },

        clear: function() {
            var _self = this;
            this.$element.bind({
                mouseenter: function() {
                    clearInterval(_self.time);
                },
                mouseleave: function() {
                    _self.auto();
                }
            });
        },
        debug: function($message) {
            if (typeof $message == 'undefined') {
                $message = this;
            } else if (window.console && window.console.log) {
                window.console.log($message);
            } else {
                alert($message);
            }
        },
        callback: function(evt) {
            if (typeof this.options[evt + 'callback'] != 'function') {
                return false;
            } else {
                this.options[evt + 'callback'].call(this);
            }
        }
    };

})(jQuery);