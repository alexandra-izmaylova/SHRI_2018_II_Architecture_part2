class Dispatcher {
	constructor() {
		this.callbacks = [];
	}
	register(callback) {
		this.callbacks.push(callback);
	}
	dispatch(payload) {
		this.callbacks.forEach(callback => callback(payload));
	}
	unregister(callback) {
		let index = this.callbacks.indexOf(callback);
		if (index != -1) {
			this.callbacks.splice(index, 1);
		}
	}
}

export { Dispatcher };
