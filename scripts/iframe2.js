(function(){
	console.log(123);
	znnAddEventListenerMessage(window, function(event) {
        console.log("接收到iframe发的消息--" + event.data.message);
    })
    znnPostMessage(window.top, {
        message: "iframe2向iframe发了消息",
        type: "getLocalStorage"
    }, "http://znn.com:9000", window, function(event) {
        console.log("iframe2接受到iframe的回信--" + event.data.message);
    });
});