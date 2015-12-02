var slice = [].slice

function Vestibule () {
    this._waiting = []
}

Vestibule.prototype.enter = function (callback) {
    var cookie = {}
    this._waiting.push({
        cookie: cookie,
        callback: callback
    })
    return cookie
}

Vestibule.prototype.leave = function (cookie) {
    for (var i = 0, I = this._waiting.length; i < I; i++) {
        if (this._waiting[i].cookie === cookie) {
            this._waiting.splice(i, 1)
            break
        }
    }
}

Vestibule.prototype.notify = function () {
    var vargs = slice.call(arguments)
    this._waiting.splice(0, this._waiting.length).forEach(function (waiting) {
        waiting.callback.apply(null, vargs)
    })
}

module.exports = Vestibule
