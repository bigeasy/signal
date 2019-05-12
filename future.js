// Finding Promise construction cumbersome. Happy to have an object at the
// outset that bundles the promise with with the the notification. Makes it
// easier to create data structures containing promises.
class Future {
    constructor () {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }

    resolve () {
        switch (arguments.length) {
        case 0:
            this._resolve.call()
            break
        case 1:
            if (arguments[0] instanceof Error) {
                this._reject.call(null, arguments[0])
            } else {
                this._resolve.call(null, arguments[0])
            }
            break
        case 2:
            //this._resolve(vargs)
            if (arguments[0] != null) {
                this._reject.call(null, arguments[0])
            } else {
                this._resolve.call(null, arguments[1])
            }
        }
    }
}

module.exports = Future
