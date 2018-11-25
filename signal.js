var operation = require('operation')

function Signal () {
    this._cancels = [ this._waits = [] ]
    this._cookie = 0
    this.open = null
    if (arguments.length != 0) {
        this.wait.apply(this, arguments)
    }
}

Signal.prototype.wait = function () {
    var vargs = []
    vargs.push.apply(vargs, arguments)
    var callback = operation.shift(vargs)
    if (this.open == null) {
        var cookie = this._cookie++
        this._waits.push({ cookie: cookie, callback: callback })
        return cookie
    }
    callback.apply(null, this.open)
    return null
}

Signal.prototype.cancel = function (cookie) {
    for (var i = 0, I = this._cancels.length; i < I; i++) {
        for (var j = 0, J = this._cancels[i].length; j < J; j++) {
            if (this._cancels[i][j].cookie === cookie) {
                return this._cancels[i].splice(j, 1).shift().callback
            }
        }
    }
    return null
}

// Notify listening waits.

//
Signal.prototype.notify = function () {
    if (this._waits.length != 0) {
        // We shift a new array into waiting so that a notified function can
        // wait on a subsequent notification. We do not pop it or replace it
        // because we want our cancel function above to be able to find it and
        // cancel it. We're going to want to be able cancel both exiting waits
        // and waits added during the notification.
        var waits = this._waits
        this._cancels.push(this._waits = [])

        // We shift first so we don't wreck the array if a wait cancels itself.
        while (waits.length != 0) {
            var waited = waits.shift()
            waited.callback.apply(null, arguments)
        }

        var i = 0
        while (i < this._cancels.length) {
            if (this._cancels[i] === waits) {
                break
            }
            i++
        }
        while (i <= this._cancels.length - 1) {
            this._cancels[i] = this._cancels[i + 1]
            i++
        }
        this._cancels.length--
    }
}

// Notify listening waits with arguments that will be immediately given to any
// subsequent waits.

//
Signal.prototype.unlatch = function () {
    if (this.open == null) {
        this.open = []
        this.open.push.apply(this.open, arguments)
        this.notify.apply(this, this.open)
    }
}

module.exports = Signal
