var loadScript = function(config) {
    /**
     * [DEFAULT description]
     * @type {Object}
     * baseUrl: String 根路径
     * type: String 加载文件类型，目前只支持js和css
     * path: {Object} 要加载文件的路径 这里是同步加载 document.write()
     * 			{
     * 				jquery:'jQuery-3.0.0'
     * 			}
     * async: 是否是异步
     * notCachePath {Array} 不需要缓存的文件，后面回家时间初参数来清缓存
     * 			[
     * 				"jquery"
     * 			]
     */
    var DEFAULT = {
        baseUrl: "",
        type: "script",
        path: {},
        async: false,
        notCachePath: [],
        callback: null
    }

    //传进来的config copy一份
    var CUSTOM_CONFIG = config;

    function createConfig() {
        var _config = {};
        for (var key in DEFAULT) {
            _config[key] = CUSTOM_CONFIG[key] || DEFAULT[key];
        }
        return _config;
    }

    function createPath(pathName) {
        var path = createConfig().path[pathName];
        if (path.indexOf(".js") === -1 && path.indexOf(".css") === -1) {
            switch (createConfig().type) {
                case "script":
                    path += ".js";
                    break;
                case "css":
                    path += ".css";
                default:
                    break;
            }
        }
        if (path.indexOf("http:") !== 0 && path.indexOf("https:") !== 0 && path.indexOf("/") !== 0 && path.indexOf(".") !== 0) {
            path = createConfig().baseUrl + path;
        }
        if (isCache(pathName)) {
            path += "?v=" + new Date().getTime();
        }
        return path;
    }

    function creatNom(pathName) {
        var dom = "";
        switch (createConfig().type) {
            case "script":
                dom = '<script type="text/javascript" src=' + createPath(pathName) + '></sc' + 'ript>';
                break;
            case "css":
                dom = '<link rel="stylesheet" href=' + createPath(pathName) + '>';
            default:
                break;
        }
        return dom;
    }

    //false:不需要
    function isCache(pathName) {
        return createConfig().notCachePath.indexOf(pathName) !== -1;
    }

    function syncPath(pathName) {
        document.write(creatNom(pathName));
    }

    function asyncPath(pathName) {
        var domScript = document.createElement('script');
        domScript.type = "text/javascript";
        domScript.src = createPath(pathName);
        document.body.append(domScript);
    }

    function init() {
        for (var pathName in createConfig().path) {
            createConfig().async ? asyncPath(pathName) : syncPath(pathName)
        };
        createConfig().callback && createConfig().callback();
    }

    return init();
};