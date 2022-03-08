/**
 * Created by zhangnn on 2018/4/2.
 *
 * Query Sring ==> application/json
 * Form Data ==> application/x-www-form-urlencoded
 * Request Payload ==> multipart/form-data  提交文件 例如表单上传文件
 *
 * 拦截器是axios提供的方法
 *
 * 使用
 * 1. axiosHttp("./data.json", {param1:value1,param2:value2});
 * 2. axiosHttp({axios的配置项});
 *
 * 返回的是一个Promise对象
 */
import axios from 'axios';

const DEFAULT = {

};

const instance = axios.create({
    xsrfCookieName: 'xsrf-token',
    xsrfHeaderName: 'xsrf-token',
    headers: {'X-Requested-With': 'XMLHttpRequest'}
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 成功
    if (response.data && response.data.head && response.data.head.code === "00000000") {
        return Promise.resolve(response.data.body);
    } else if (response.data && response.data.head && response.data.head.code === "11111114") { // 2.session过期
        if (app.jumpFromBaby) {
            appCommon.uiUtils.middleInfo("登录已失效，请重新登录", function () {
                nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'enterFJTax' });
            });

            //关闭续费子窗口
            nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'submitOrders' });
            nativeJs.getMicroData('MCP_DZB_CLOSEBROWSER', { identify: 'ownRenewalOrders' });

        } else {
            appCommon.uiUtils.middleInfo('登录已失效，请重新登录', function () {
                appRouter.navigate('quit', { trigger: true });
            });
        }
        return Promise.reject({
            messageCode: 'timeout'
        });
    } else if (response.data && response.data.head && response.data.head.code !== "11111111") {
        appCommon.uiUtils.warning(response.data.head.msg);
        return Promise.reject(response.data);
    } else if (response.data && response.data.head && response.data.head.code === "11111111") {
        appCommon.uiUtils.warning("服务器正忙，请稍后重试");
        return Promise.reject({
            messageCode: 'netError'
        });
    } else {
        // 3.其他失败，比如校验不通过等
        // response.data.otherError = true;
        return Promise.reject({
            messageCode: 'netError'
        });
    }
}, function (error) {
    // 4.系统错误，比如500、404等
    console.log("error");
    return Promise.reject("error");
});

//第一个参数可以是url字符串，也可以是 一个对象，该对象是axios的config配置项
function getConfig(url, data, method) {
    if (Object.prototype.toString.call(url) === "[object Object]") {
        return Object.assign({}, DEFAULT, url);
    } else {
        let params = (method === "get" || method === "postQueryString") ? data : null;
        let datas = !(method === "get" || method === "postQueryString") ? data : null;
        let contentType = "application/json;charset=utf-8";
        if (method === "postFile") {
            method = "post";
            contentType = "multipart/form-data;charset=utf-8";
            let form = new FormData(); //创建form对象
            for (var key in data) {
                form.append(key, data[key]);
            }
            datas = form;
        } else if (method === "postFormData") {
            method = "post";
            contentType = "application/x-www-form-urlencoded;charset=utf-8";
        } else if (method === "postQueryString") {
            method = "post";
            contentType = "application/json;charset=utf-8";
        }
        return Object.assign({}, DEFAULT, {
            url: url,
            method: method,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                "Content-Type": contentType
            },
            params: params,
            data: datas
        });
    }
}

const requestType = ['get', 'post', 'put', 'deletes', 'postFile', 'postFormData', 'postQueryString'];
let exportFn = {};
requestType.forEach(function (item) {
    exportFn[item] = function (url, data) {
        return instance[item](url, getConfig(url, data, item));
    };
});

export default exportFn;
