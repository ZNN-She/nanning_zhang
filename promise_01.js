// 
function Promise(excutor){
	const self = this;
	this.value = null;
	this.status = 'padding'; // 装填
	this.reason = null;
	this.onFul = []; // 回调存储 用数组存储多个then的情况
	this.onReject = [];

	// 声明内部函数
	const resolve = (value) =>{
		// 链式调用判断是否是一个promise对象
		if(value instanceof Promise){
			return value.then(resolve, reject);
		}
		// 延时，改变执行顺序，防止还没绑定就执行了resolve
		setTimeout(() => {
			if(this.status === 'padding'){
				this.value = value;
				this.status = 'resolve';
				this.onFul.forEach(item => item(this.value));
			}
		})
	}

	// 声明内部函数
	const reject = (value) => {
		// 延时，改变执行顺序，防止还没绑定就执行了reject
		setTimeout(() => {
			if(this.status === 'padding'){
				this.value = value;
				this.status = 'reject';
				this.onReject.forEach(item => item(this.reason));
			}
		})
	}

	// 异常抛错 reject
	try {
		excutor(resolve, reject);
	} catch (error) {
		reject(error)
	}
}

// then
Promise.prototype.then = function(onFul, onReject){
	onFul = typeof onFul === 'function' ? onFul : (data) => data;
	onReject = typeof onReject === 'function' ? onReject : (error) => {throw error};
	// 加参数类型判断
	if(this.status === 'resolve'){
		onFul(this.value)
	}
	if(this.status === 'reject'){
		onReject(reason)
	}
	// 绑定回调
	if(this.status === 'padding'){
		this.onFul.push(onFul);
		this.onReject.push(onReject);
	}
}

// const a = new Promise(resolve, reject); resolve(); return a;
const testPromise = new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log(1);
		resolve(1);
		// reject(3);
	}, 1000);
});

testPromise.then((resolve) => {
	console.log(resolve)	
}, (reject) => {
	console.log(1, reject)
})

testPromise.then((resolve) => {
	console.log(2, resolve)	
}, (reject) => {
	console.log(reject)
})