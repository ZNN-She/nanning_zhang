/**
 * Created by nanning_zhang on 2016/7/10.
 */
var zNetwork = (function(window, undefined) {
    var DEFAULT = {
        url: null,
        type: "get",
        dataType: 'json',
        timeout: 10000,
        contentType: "application/json; charset=utf-8",
        headers: { 'Content-Type': 'application/json' },
        data: null,
        success: function(data) {
            if (data.resultCode === 0) {
                mui.toast(data.resultMessage);
                $.hideLoading();
            } else if (data.resultCode == -1) {
                //cookie过期
                window.location.href = data.resultMessage;
                $.hideLoading();
            } else {
                mui.toast(data.resultMessage);
                $.hideLoading();
            }
        },
        error: function(xhr, type, errorThrown) {
            //异常处理；
            mui.toast("请求错误:" + xhr.status + "|" + xhr.statusText);
            $.hideLoading();
        }
    };

    function getOption(url, type, param, data, successCallback, errorCallback, headers) {
        var settings = {
            url: url,
            type: type,
            data: param || data,
            success: successCallback,
            error: errorCallback
        };
        settings = $.extend({}, DEFAULT, settings);
        settings.headers = headers || settings.headers;
        return settings;
    }

    //获取相应回调集合
    function getAction(callback, deferred) {
        var options = {};
        var DEFAULTS = {
            successCallback: null, //成功回调
            errorCallback: null, //错误回调
            failCallback: null, //完成动作
            custom: false, //自定义
            deferred: deferred
        };

        options = typeof(callback) == "object" ? $.extend({}, DEFAULTS, callback) : $.extend({}, DEFAULTS, {
            successCallback: callback
        });

        return getCallback(options);
    }

    function globalResolve(data) {
        if (data.resultCode == -1) { //cookie过期
            location.href = data.resultMessage;
        }
    }

    function needGlobalResolve(data) {
        var sourceCode = ["-1", "-3", "-6"];
        return sourceCode.indexOf(String(data.resultCode)) != -1;
    }

    //生成回调
    function getCallback(options) {
        var successHandler, errorHandler;

        //创建成功回调
        if (options.custom) {
            successHandler = options.successCallback;
        } else {
            successHandler = function(data) {
                if (data.resultCode == 0) {
                    options.successCallback && options.successCallback.call(this, data);
                    $.hideLoading();
                }
                //全局处理    
                else if (needGlobalResolve(data)) {
                    globalResolve(data);
                    $.hideLoading();
                }
                //执行失败回调
                else {
                    if (options.failCallback) {
                        options.failCallback && options.failCallback(data);
                        $.hideLoading();
                    } else {
                        $.toast(data.resultMessage, "text");
                        $.hideLoading();
                    }
                }
            }
        }
        //创建失败回调
        if (options.errorCallback && typeof options.errorCallback == "function") {
            deferred && deferred.reject();
            errorHandler = options.errorCallback;
        } else {
            errorHandler = function(xhr, type, errorThrown) {
                deferred && deferred.reject();
                $.toast("请求错误：" + xhr.status + "|" + xhr.statusText, "text");
                $.hideLoading();
            }
        }

        return {
            success: successHandler,
            error: errorHandler
        }
    }

    return {
        get: function(url, param, action, deferred) {
            var callBack = getAction(action, deferred);
            return $.ajax(getOption(url, "get", param, null, callback.success, callback.error));
        },
        post: function(url, param, data, action, deferred) {
            var callBack = getAction(action, deferred);
            return $.ajax(getOption(url, "post", param, data, callback.success, callback.error));
        },
        put: function(url, param, data, action, deferred) {
            var callBack = getAction(action, deferred);
            $return .ajax(getOption(url, "put", param, data, callback.success, callback.error));
        },
        deletes: function(url, param, data, action, deferred) {
            var callBack = getAction(action, deferred);
            return $.ajax(getOption(url, "delete", param, data, callback.success, callback.error));
        },
        postFormData: function(url, param, action, deferred) {
            var callBack = getAction(action, deferred);
            var headers = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };
            return $.ajax(getOption(url, "post", param, null, callback.success, callback.error, headers));
        }
    }
}(window));
