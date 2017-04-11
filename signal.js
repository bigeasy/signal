var Operation = require('operation/variadic')

function Signal () {
    this._waiting = []
    this.occupied = false
    this.open = null
}

Signal.prototype.wait = function () {
    var vargs = Array.prototype.slice.call(arguments)
    var timeout = typeof vargs[0] == 'number' ? vargs.shift() : null
    var timer = null
    var callback = Operation(vargs)
    if (this.open == null) {
        if (timeout != null) {
            timer = setTimeout(this.notify.bind(this), timeout)
        }
        var cookie = {}
        this.occupied = true
        this._waiting.push({
            cookie: cookie,
            callback: callback,
            timeout: timer
        })
        return cookie
    }
    callback.apply(null, this.open)
    return null
}

Signal.prototype.cancel = function (cookie) {
    var left = null
    for (var i = 0, I = this._waiting.length; i < I; i++) {
        if (this._waiting[i].cookie === cookie) {
            left = this._waiting.splice(i, 1).shift()
            break
        }
    }
    this.occupied = this._waiting.length != 0
    if (left == null) {
        return null
    }
    if (left.timeout != null) {
        clearTimeout(left.timeout)
    }
    return left.callback
}

Signal.prototype.notify = function () {
    var vargs = Array.prototype.slice.call(arguments)
    this.occupied = false
    this._waiting.splice(0, this._waiting.length).forEach(function (waiting) {
        if (waiting.timeout) {
            clearTimeout(waiting.timeout)
        }
        waiting.callback.apply(null, vargs)
    })
}

Signal.prototype.unlatch = function () {
    this.notify.apply(this, this.open = Array.prototype.slice.call(arguments))
}

module.exports = Signal