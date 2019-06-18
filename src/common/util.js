// function localStorage() {
//     if(!window.localStorage){
//         alert('浏览器不支持localstorage')
//         return false
//     }
// 	return window.localStorage
// }

export const storage = {
    set(key, data){
        window.localStorage.setItem(key,JSON.stringify(data))
    },
    get(key){
        return JSON.parse(window.localStorage.getItem(key))
    },
    remove(key){
        window.localStorage.removeItem(key)
    },
    clearAll(){
        window.localStorage.clear()
    }
}
export const sessionStorage = {
    set(key, data){
        window.sessionStorage.setItem(key,JSON.stringify(data))
    },
    get(key){
        return JSON.parse(window.sessionStorage.getItem(key))
    },
    remove(key){
        window.sessionStorage.removeItem(key)
    },
    clearAll(){
        window.sessionStorage.clear()
    }
}
// 函数防抖 debounce 
export const debounce = function (fn, delay) {
	let last = 0, timer = null
	return function () {
		let context = this
		let args = arguments
		let now = +new Date()

		if (now - last < delay) {
			clearTimeout(timer)
			timer = setTimeout(function () {
				last = now
				fn.apply(context, args)
			}, delay)
		} else {
			last = now
			fn.apply(context, args)
		}
	}
}
// 函数节流 throttle
export const throttle = function (fn, interval) {
	let last = 0
	return function () {
		let context = this
		let args = arguments
		let now = +new Date()
		
		if (now - last >= interval) {
			last = now;
			fn.apply(context, args);
		}
	}
}
export default{
    storage,
    sessionStorage,
    debounce,
    throttle,
} 