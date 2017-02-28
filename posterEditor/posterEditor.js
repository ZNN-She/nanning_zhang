+(function($) {
	var PosterEditor = function(elem, options) {
		this.options = options;
		this.$element = $(element); //容器
		this.$canvas = null; //画布
		this.$transform = null; //变形器
		this.$guider = null; //参考线
		this.$seletor = null; //选择

		this.render();
		this.bindEvent();
	}

	PosterEditor.DEFAULTS = {
		data: null, //数据
		background: null, //背景颜色
		width: null, //画布高度
		height: null, //画布宽度
		zoom: 1 //缩放比例
	};

	/*PosterEditor.prototype = {
		undo: function() {}, //撤销
		redo: function() {}, //重做
		render: function() {}, //渲染
		createTransform: function() {}, //创建自由变换框
		createGuider: function() {}, //创建参考线
		createCavans: function() {}, //创建画布
		createEditorElem: function() {}, //创建元素
		removeEditorElem: function() {}, //删除元素
		scale: function() {}, //缩放比例
		bindEvent: function() {}, //绑定事件
		getData: function() {}, //获取结果数据
		setSize: function(w,h) {}, //设置宽度和高度
		isLinkMode: null, //是否在编辑模式
		enterLinkMode: function(w,h) {}, //设置宽度和高度
		exitLinkMode: function(w,h) {}, //设置宽度和高度
	}*/

	PosterEditor.prototype.render = function() {
		//设置容器宽度
		//渲染元素
		//绑定事件
	}

	PosterEditor.prototype.bindEvent = function() {
		//绑定元素事件
		//绑定选中事件
	}

	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var options = $.extend(PosterEditor.DEFAULTS, option)
			var data = $element.data("dp.PosterEditor");

			if (!data) {
				$element.data("dp.PosterEditor", data = new PosterEditor(this, options));
			} else if (typeof options == "string") {
				data[option]();
			}
		});
	}

	//手动调用
	$.fn.posterEditor = Plugin;

	$.fn.getPosterEditor = function() {
		var $elem = $(this[0]);
		if (!elem) {
			return null
		}

		var data = $elem.data("dp.posterEditor");

		return data || null;
	}

})(jQuery);


/*var DEFAULTS = {
	elem: {
		type: "",
		category: "",
		opacity: 1,
		padding: [0, 0, 0, 0],
		height: 200,
		width: 200,
		left: 0,
		top: 0,
		transform: {
			a: 1,
			b: 0,
			c: 0,
			d: 1,
			tx: 0,
			ty: 0
		},
		boxShadow: null,
		resize: 7,
		dragable: !0,
		rotatable: !0,
		hidden: !1,
		lock: !1,
		guider: {
			show: !0,
			snapTo: !0
		},
		clip: null
	},
	elemExts: {
		$id: 0,
		$loaded: !1,
		$selected: !1,
		$editing: !1,
		$draging: !1,
		$getDragLimit: null,
		$getResizeLimit: null
	},
	imageElem: {
		url: ""
	},
	textElem: {
		color: "#000000",
		padding: [6, 8, 6, 8],
		fontFamily: "Simsun",
		fontStyle: "normal",
		fontWeight: 400,
		fontSize: 20,
		lineHeight: 1.2,
		letterSpacing: 0,
		textDecoration: "none",
		writingMode: "horizontal-tb",
		textAlign: "left",
		verticalAlign: "top",
		content: "",
		textShadow: null,
		resize: 4
	},
	svgElem: {
		url: "",
		content: "",
		colors: null,
		resize: 1
	},
	maskElem: {
		image: null,
		resize: 1,
		clip: {
			bottom: 0,
			right: 0,
			left: 0,
			top: 0
		}
	},
	groupElem: {
		elems: [],
		resize: 1
	}
}*/