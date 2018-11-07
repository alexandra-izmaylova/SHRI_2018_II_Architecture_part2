class EventEmitter {
    constructor() {
        this.map = new Map();
    }
    addEventListener(event, listener) {
        const listeners = this.map.get(event);
        if (listeners) {
            listeners.push(listener);
        } else {
            this.map.set(event, [listener]);
        }
    }
    removeEventListener(event, listener) {
        const listeners = this.map.get(event);
        if (listeners) {
            let index = listeners.indexOf(listener);
            if (index != -1) {
                listeners.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    emit(event, ...args) {
        const listeners = this.map.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(...args));
        }
    }
}

export { EventEmitter };
