var slice = [].slice

function Vestibule () {
    this._waiting = []
    this.occupied = false
    this.open = null
}

Vestibule.prototype.enter = function (callback) {
    if (this.open == null) {
        var cookie = {}
        this.occupied = true
        this._waiting.push({
            cookie: cookie,
            callback: callback
        })
        return cookie
    }
    callback.apply(null, this.open)
    return null
}

Vestibule.prototype.leave = function (cookie) {
    for (var i = 0, I = this._waiting.length; i < I; i++) {
        if (this._waiting[i].cookie === cookie) {
            this._waiting.splice(i, 1)
            this.waiting--
            break
        }
    }
}

Vestibule.prototype.notify = function () {
    var vargs = slice.call(arguments)
    this.occupied = false
    this._waiting.splice(0, this._waiting.length).forEach(function (waiting) {
        waiting.callback.apply(null, vargs)
    })
}

module.exports = Vestibule
