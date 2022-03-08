var znnPostMessage = function(_iframeWindow, data, origin, _window, callback){
	_iframeWindow.postMessage(data, origin);
	_window && _window.addEventListener("message", callback);
};

var znnAddEventListenerMessage = function(_window, callback){
	_window.addEventListener("message",callback);
}

var znnCreateIframe = function(attr){
	var iframe = document.createElement('iframe');
	for(var key in attr){
		iframe[key] = attr[key];
	}
	return iframe;
}

var znnSyncLocalStorage = function(){

}

var znnSyncSessionStorage = function(){
	
}