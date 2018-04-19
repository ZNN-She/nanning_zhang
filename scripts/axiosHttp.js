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

function getConfig(url, param, paramData, method) {
    if (Object.prototype.toString.call(url) === "[object Object]") {
        return Object.assign({}, DEFAULT, url)
    } else {
        return Object.assign({}, DEFAULT, {
            url: url,
            method: method,
            data: JSON.stringify(paramData),
            params: param
        });
    }
}

function thenCallback(resultData, successCallback, fileCallback) {
    if (resultData.head && resultData.head.code === "00000000") {
        successCallback ? successCallback(resultData) : console.log("successCallback is not undefined")
    } else if (resultData.head && resultData.head.code === "11111114") {
        appCommon.uiUtils.warning("登录失效");
        if (app.jumpFromBaby) {
            appCommon.uiUtils.middleInfo("登录已失效，请重新登录", function() {
                nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'enterFJTax' });
            });

            //关闭续费子窗口
            nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'submitOrders' });
            nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'ownRenewalOrders' });
        } else {
            appCommon.uiUtils.middleInfo('登录已失效，请重新登录', function() {
                appRouter.navigate('quit', { trigger: true });
            });
        }
    }
    if (resultData.head && resultData.head.code === "11111111") {
        appCommon.uiUtils.warning("服务器正忙，请稍后重试");
    } else {
        fileCallback ? fileCallback(resultData) : function(){
          appCommon.uiUtils.warning(resultData.head.code + resultData.head.msg); //提示错误吗+错误信息
          console.log(resultData);//打印出来方便查看错误
        };
    }
}

function catchCallback(error, errorCallback) {
    errorCallback ? errorCallback : function(error) {
        console.log(error);
    }
}

function httpAxios(config, successCallback, fileCallback) {
    axios(config)
    .then(function(response) {
        thenCallback(response.data, successCallback, fileCallback);
    })
    .catch(catchCallback(error, errorCallback));
}

let methods = {};

["get", "post", "put", "delete"].forEach(function(item) {
  mothods[item] = 
})

export default {
    get: function(url, param, successCallback, fileCallback, errorCallback) {
        httpAxios(getConfig(url, param, null, 'get'), (successCallback || url.successCallback), (fileCallback || url.fileCallback));
    },
    post: function(url, param, data, successCallback, fileCallback) {
        httpAxios(getConfig(url, param, data, 'post'), (successCallback || url.successCallback), (fileCallback || url.fileCallback));
    },
    put: function(url, param, data, successCallback, fileCallback) {
        httpAxios(getConfig(url, param, data, 'put'), (successCallback || url.successCallback), (fileCallback || url.fileCallback));
    },
    delete: function(url, param, data, successCallback, fileCallback) {
        httpAxios(getConfig(url, param, data, 'delete'), (successCallback || url.successCallback), (fileCallback || url.fileCallback));
    }
}

// index.js

import request from "./axiosHttp";

const API = {
  "xx": ""
}

// header 3 ，url 

exprot const XX = function(data, header) {
  request.post
}

const XX1 



XX({}).then(() => {
  
}).catch((e) => {
  
})

get/post 


header: {
  x-token: 
}

Promise.all([XX({}), XX1({})]).then((data) => {
  data[0]
}).catch(e => {
  
})
 