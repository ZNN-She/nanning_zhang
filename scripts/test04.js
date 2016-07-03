$(document).ready(function() {
	$.each($(".main > a"), function() {
		$(this).click(function() {
			var ulNode = $(this).next("ul");
			$(".main > ul").not(ulNode).slideUp(); //加上这样一句话就可以在点击的同时关闭其他打开的菜单
			ulNode.slideToggle();

			if ($(this).css("").indexOf("") >= 0) {
				$(this).css("background-image", "url()");
			} else {
				$(this).css("background-image", "url()");
			}
		});
	});
});