(function($) {

    function Loading(promise, element, options) {
        /*if(promise instanceof Object){

        }else{

        }*/
        var self = this;

        self.option = $.extend(true, {}, options);
        self.$ele = $(element);
        self.promise = promise;

        self.show();

    }
    Loading.DEFAULT = {
        maskEle: '<div id="snake-loading" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background-color: rgba(0,0,0,0.5);">' + '<div class="sk-fading-circle">' + '<div class="sk-circle1 sk-circle"></div>' + '<div class="sk-circle2 sk-circle"></div>' + '<div class="sk-circle3 sk-circle"></div>' + '<div class="sk-circle4 sk-circle"></div>' + '<div class="sk-circle5 sk-circle"></div>' + '<div class="sk-circle6 sk-circle"></div>' + '<div class="sk-circle7 sk-circle"></div>' + '<div class="sk-circle8 sk-circle"></div>' + '<div class="sk-circle9 sk-circle"></div>' + '<div class="sk-circle10 sk-circle"></div>' + '<div class="sk-circle11 sk-circle"></div>' + '<div class="sk-circle12 sk-circle"></div>' + '</div>' + '</div>'
    };
    Loading.prototype.show = function() {
        var self = this;

        self.$ele.append(self.option.maskEle);
        self.$ele.css("position", "relative");


        /*if (element) {
            $(element).append(maskEle);
            element.css("position", "relative");
        } else {
            $("body").append(maskEle);
        }*/
        console.log("出现loading");
        $.when(self.promise).then(
            function() {
                console.log("loading消失");
                self.hide()
            }
        );
        /*$.when(self.promise).done(function() {
            console.log("loading消失done");
            self.hide();
        }).fail(function() {
            console.log("loading消失fail");
            self.hide();
        }).progress(function(res) {
            console.log("loading消失progress");
            self.hide();
        });*/
    }
    Loading.prototype.hide = function(element) {
        var self = this;
        if (element) {
            $(element).children('#snake-loading').remove();
            element.css("position", "");
        } else {
            self.$ele.children('#snake-loading').remove();
            self.$ele.css("position", "");
        }
    }

    function Plugin(promise, element, options) {
        element = element || $("body");
        return element.each(function() {
            var $this = $(this);
            var data = $(this).data("snake.loading");
            var options = $.extend({}, $.extend(Loading.DEFAULT), typeof options == "object" && options);

            $this.data("snake.loading", (data = new Loading(promise, this, options)))
            if (typeof promise == "hide") {
                data.hide(option);
            }
        });
    }

    _addStyle = function() {
        var style = document.createElement('link'); //创建一个style元素
        var head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.rel = 'stylesheet'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        style.setAttribute("href", "loading.css");
        head.appendChild(style); //把创建的style元素插入到head中
    }

    function _init() {
        _addStyle();
    }
    _init();

    var old = $.fn.loading

    jQuery.loading = $.fn.loading = Plugin;

    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.loading.noConflict = function() {
        $.fn.loading = old
        return this
    }
})(jQuery);
