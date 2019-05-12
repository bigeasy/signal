const Future = require('./future')

class Turnstile {
    constructor () {
        this._futures = []
    }

    enter () {
        const future = new Future
        this._futures.push(future)
        return future.promise
    }

    twist () {
        if (this._futures.length != 0) {
            const future = this._futures.shift()
            future.resolve.apply(future, arguments)
        }
    }
}

module.exports = Turnstile
