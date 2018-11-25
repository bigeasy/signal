var Operation = require('operation')

function Signal () {
    this._cancels = [this._waits = []]
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
        this._waits.push({
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
    for (var i = 0, I = this._cancels.length; i < I; i++) {
        for (var j = 0, J = this._cancels[i].length; j < J; j++) {
            if (this._cancels[i][j].cookie === cookie) {
                left = this._cancels[i].splice(j, 1).shift()
                break
            }
        }
    }
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

    // We shift a new array into waiting so that a notified function can wait on
    // a subsequent notification. We do not pop it or replace it because we want
    // our cancel function above to be able to find it and cancel it. We're
    // going to want to be able cancel both exiting waits and waits added during
    // the notification.
    var waits = this._waits
    this._cancels.unshift(this._waits = [])

    // We shift first so we don't wreck the array if a wait cancels itself.
    while (waits.length != 0) {
        var waited = waits.shift()
        if (waited.timeout !== null) {
            clearTimeout(waited.timeout)
        }
        waited.callback.apply(null, vargs)
    }

    this._cancels.splice(this._cancels.indexOf(waits), 1)
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
