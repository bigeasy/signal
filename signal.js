var Operation = require('operation/variadic')

function Signal () {
    this._waiting = [[]]
    this.occupied = false
    this.open = null
    if (arguments.length != 0) {
        this.wait.apply(this, Array.prototype.slice.call(arguments))
    }
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

// Notify listening waits.

//
Signal.prototype.notify = function () {
    var vargs = Array.prototype.slice.call(arguments)

    // Dubious. No real use for it. Plus, it might as well be a count.
    this.occupied = false

    // We shift a new array into waiting so that a notified function can wait on
    // a subsequent notification. We do not pop it or replace it because we want
    // our cancel function above to be able to find it and cancel it. We're
    // going to want to be able cancel both exiting waits and waits added during
    // the notification.
    var waiting = this._waiting[0]
    this._waiting.unshift([])

    // We shift first so we don't wreck the array if a wait tries to itself.
    while (waiting.length != 0) {
        var waited = waiting.shift()
        if (waited.timeout !== null) {
            clearTimeout(waited.timeout)
        }
        waited.callback.apply(null, vargs)
    }

    // Do not understand why this is necessary. Why can't we just pop?
    this._waiting = this._waiting.filter(function (waiting, index) {
        return index == 0 || waiting.length > 0
    })
}

// Notify listening waits with arguments that will be immediately given to any
// subsequent waits.

//
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
