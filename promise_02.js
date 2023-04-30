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
		// 返回一个新的promise，链式调用关键
		return promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					// 这个新的promise2 resolve的值为onFul的执行结果
					let result = onFul(this.value);
					resolve(result);
				} catch (error) {
					reject(error)
				}
			})
		})
	}
	if(this.status === 'reject'){
		// 返回一个新的promise，链式调用关键
		return promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					// 这个新的promise2 reject的值为onReject的执行结果
					let result = onReject(this.value);
					resolve(result); // 这里是resolve
				} catch (error) {
					reject(error)
				}
			})
		})
	}
	// 绑定回调
	if(this.status === 'padding'){
		return promise2 = new Promise((resolve, reject) => {
			this.onFul.push(() => {
				try {
					let result = onFul(this.value);
					resolve(result);
				} catch (error) {
					reject(error)
				}
			})
			this.onReject.push(() => {
				try {
					let result = onReject(this.value);
					resolve(result);
				} catch (error) {
					reject(error)
				}
			})
		})
	}
}

// const a = new Promise(resolve, reject); resolve(); return a;
// Promise接收一个函数(resolve, reject) => void;
// new的时候调用接收的函数，并传递resolve, reject
// then函数也接收两个函数resolve, reject
// 调用then函数存储then里外部传递的函数
// 在传递给 new Promise接收函数里调用resolve或reject，resolve/reject内部会调用then传递的函数
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
	console.log(2, resolve);
	return 22;
}, (reject) => {
	console.log(reject)
}).then((resolve) => {
	console.log(22, resolve);
})