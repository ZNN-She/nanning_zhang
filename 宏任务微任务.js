// 任务---线程---进程
// 一个线程可以有多个任务
// 线程是进程执行的基本单元，同一进程的线程共享本进程的地址空间，而进程之间则是独立的地址空间；
// 进程是指在系统中正在运行的一个应用程序，每个进程之间是独立的，每个进程均运行在其专用的且受保护的内存
console.log('1');
new Promise((resolve, reject) => {
	console.log('2');
	resolve();
}).then(() => {
	console.log('3');
	return new Promise((resolve, reject) => {
		console.log('4');
		resolve();
	})
}).then(() => {
	console.log('5');
})
console.log('6');
// 126345


console.log(1);
new Promise((resolve, reject) => {
	console.log('2');
	setTimeout(() => {
		console.log(3)
	}, 0)
	resolve();
}).then(() => {
	console.log('4');
	setTimeout(() => {
		console.log(5)
	}, 0)
	return new Promise((resolve, reject) => {
		console.log('6');
		setTimeout(() => {
			console.log(7)
		}, 0)
		resolve();
	})
}).then(() => {
	console.log('8');
})
console.log(9);
// 129468357

// 先微任务在泓任务
// 微任务Promise.then、MutationObserve、process.nextTick(node.js)