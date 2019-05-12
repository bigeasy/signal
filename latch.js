class Latch {
    constructor (promise) {
        this._callbacks = []
        this._vargs = null
    }

    then (promise) {
        promise.then((value) => {
            this.unlatch(null, value)
        }, (error) => {
            this.unlatch(error)
        })
        return this
    }

    unlatch (...vargs) {
        this._vargs = vargs
        this._callbacks.forEach(f => f.apply(null, vargs))
    }

    await (f) {
        this._callbacks.push(f)
        if (this._vargs != null) {
            f.apply(null, this._vargs)
        }
        return f
    }

    cancel (f) {
        const index = this._callbacks.indexOf(f)
        if (~index) {
            return this._callbacks.splice(index, 1).shift()
        }
        return null
    }
}

module.exports = Latch
