/**
 * Created by SNAKE on 2017/8/30.
 */
import axios from 'axios'

var DEFAULT = {
    url: "",
    method: "get",
    params: {},
    data: {},
    timeout:10000, //10秒
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
};

// json form file
//第一个参数可以是url字符串，也可以是 一个对象，该对象是axios的config配置项
function getConfig(url, data, method) {
    if (Object.prototype.toString.call(url) === "[object Object]") {
        return Object.assign({}, DEFAULT, url)
    } else {
        return Object.assign({}, DEFAULT, {
            url: url,
            method: method,
            params: method == "get" ? JSON.stringify(data) : {},
            data: method != "get"?JSON.stringify(data) : {}
        });
    }
}

function httpAxios(config, successCallback, fileCallback) {
    axios(config)
    .then(function(response) {
        if (resultData.head && resultData.head.code === "00000000") {
            return Promise.resolve(response.data.body);
        } else if (resultData.head && resultData.head.code === "11111114") {
            appCommon.uiUtils.warning("登录失效");
            if (app.jumpFromBaby) {
                appCommon.uiUtils.middleInfo("登录已失效，请重新登录",function(){
                    nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'enterFJTax' });
                });

                //关闭续费子窗口
                nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'submitOrders' });
                nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'ownRenewalOrders' });

            }else{
                appCommon.uiUtils.middleInfo('登录已失效，请重新登录', function () {
                    appRouter.navigate('quit', { trigger: true });
                });
            }
            console.log("timeout")
            return  Promise.reject({
                messageCode: 'timeout'
            })
        }else if (resultData.head && resultData.head.code === "11111111") {
            appCommon.uiUtils.warning("服务器正忙，请稍后重试");
            return  Promise.reject({
                messageCode: 'netError'
            })
        } else {
            // 3.其他失败，比如校验不通过等
            console.log(response.data.head);
            return Promise.reject(response.data);
        }
    })
    .catch(function(error){
        console.log("请求失败");
        console.log(error);
        return Promise.reject(error);
    });
}

export default {
    get: function(url, data) {
        httpAxios(getConfig(url, data, 'get'));
    },
    post: function(url, data) {
        httpAxios(getConfig(url, data, 'post'));
    },
    put: function(url, data) {
        httpAxios(getConfig(url, data, 'put'));
    },
    delete: function(url, data) {
        httpAxios(getConfig(url, data, 'delete'));
    }
}