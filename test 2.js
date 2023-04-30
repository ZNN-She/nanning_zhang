function add(a, b){
	return a + b;
}
// function curry(fn){
// 	let limit = fn.length;
// 	return function temporaryFn(...args){
// 		if(args.length >= limit){
// 			return fn(...args);
// 		}else {
// 			return function(...args2){
// 				return temporaryFn(...args.concat(...args2))
// 			};
// 		}
// 	}
// }
function curry(){
	let _fn = arguments[0];
	let _arg = Array.prototype.splice.call(arguments, 1) || [];
	let limit = _fn.length;
	return function temporaryFn(..._arg){
		if(_arg.length >= limit){
			return _fn(..._arg);
		}else {
			return function(...args){
				return temporaryFn(..._arg.concat(...args))
			};
		}
	}
}
// console.log(curry(add)(1, 2));
// console.log(curry(add)(1)(2));
console.log(curry(add, 1, 2)());
// 但是这里不能使用curry(add, 1, 2)这种形式调用，不过个人认为这也不符合柯粒化的调用方式