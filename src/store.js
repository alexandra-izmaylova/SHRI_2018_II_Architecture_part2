import { EventEmitter } from './eventEmitter.js';

class Store {
    constructor(dispatcher, event, initialState) {
        this.state = initialState;
        this.event = event;
        this.eventEmitter = new EventEmitter();
        dispatcher.register(payload => {
            const newState = this.processPayload(this.state, payload);
            if (newState !== this.state) {
                this.state = newState;
                this.eventEmitter.emit(event, this.state);
            }
        });
    }
    //обрабатывает события и возвращает новое состояние
    processPayload(state, payload) {}

    addListener(listener) {
        this.eventEmitter.addEventListener(this.event, listener);
    }
    removeListener(listener) {
        this.eventEmitter.removeEventListener(this.event, listener);
    }
}

export { Store };
