var Operation = require('operation/variadic')

function Signal () {
    this._waiting = [[]]
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
        this._waiting[0].push({
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
        for (var j = 0, J = this._waiting[i].length; j < J; j++) {
            if (this._waiting[i][j].cookie === cookie) {
                left = this._waiting[i].splice(j, 1).shift()
                break
            }
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
    var waiting = this._waiting[0]
    this._waiting.unshift([])
    while (waiting.length != 0) {
        if (waiting[0].timeout) {
            clearTimeout(waiting[0].timeout)
        }
        waiting[0].callback.apply(null, vargs)
        waiting.shift()
    }
    this._waiting = this._waiting.filter(function (waiting, index) {
        return index == 0 || waiting.length > 0
    })
}

Signal.prototype.unlatch = function () {
    if (this.open == null) {
        this.notify.apply(this, this.open = Array.prototype.slice.call(arguments))
    }
}

Signal.first = function () {
    var vargs = Array.prototype.slice.call(arguments)
    var reducer = new Signal
    reducer.wait(vargs.pop())
    for (var i = 0, signal; (signal = vargs[i]) != null; i++) {
        signal.wait(reducer, 'unlatch')
    }
}

module.exports = Signal
