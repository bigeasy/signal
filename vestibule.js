var slice = [].slice

function Vestibule () {
    this._waiting = []
    this.occupied = false
    this.open = null
}

Vestibule.prototype.enter = function (timeout, callback) {
    if (callback == null) {
        callback = timeout
        timeout = null
    }
    if (this.open == null) {
        if (timeout != null) {
            timeout = setTimeout(this.notify.bind(this), timeout)
        }
        var cookie = {}
        this.occupied = true
        this._waiting.push({
            cookie: cookie,
            callback: callback,
            timeout: timeout
        })
        return cookie
    }
    callback.apply(null, this.open)
    return null
}

Vestibule.prototype.leave = function (cookie) {
    var left = null
    for (var i = 0, I = this._waiting.length; i < I; i++) {
        if (this._waiting[i].cookie === cookie) {
            left = this._waiting.splice(i, 1).shift().callback
            break
        }
    }
    this.occupied = this._waiting.length != 0
    return left
}

Vestibule.prototype.notify = function () {
    var vargs = slice.call(arguments)
    this.occupied = false
    this._waiting.splice(0, this._waiting.length).forEach(function (waiting) {
        if (waiting.timeout) {
            clearTimeout(waiting.timeout)
        }
        waiting.callback.apply(null, vargs)
    })
}

module.exports = Vestibule
