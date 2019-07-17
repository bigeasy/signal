class Signal {
    constructor () {
        this._cancels = [ this._waits = [] ]
        this._cookie = 0
        this.open = null
        if (arguments.length != 0) {
            this.wait.apply(this, arguments)
        }
    }

    wait (callback) {
        if (this.open == null) {
            const cookie = this._cookie++
            this._waits.push({ cookie: cookie, callback: callback })
            return cookie
        }
        callback.apply(null, this.open)
        return null
    }

    cancel (cookie) {
        for (let i = 0, I = this._cancels.length; i < I; i++) {
            for (let j = 0, J = this._cancels[i].length; j < J; j++) {
                if (this._cancels[i][j].cookie === cookie) {
                    return this._cancels[i].splice(j, 1).shift().callback
                }
            }
        }
        return null
    }

    // Notify listening waits.

    //
    notify () {
        if (this._waits.length != 0) {
            // We shift a new array into waiting so that a notified function can
            // wait on a subsequent notification. We do not pop it or replace it
            // because we want our cancel function above to be able to find it and
            // cancel it. We're going to want to be able cancel both exiting waits
            // and waits added during the notification.
            const waits = this._waits
            this._cancels.push(this._waits = [])

            // We shift first so we don't wreck the array if a wait cancels itself.
            while (waits.length != 0) {
                const waited = waits.shift()
                waited.callback.apply(null, arguments)
            }

            let i = 0
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
    unlatch () {
        if (this.open == null) {
            this.open = []
            this.open.push.apply(this.open, arguments)
            this.notify.apply(this, this.open)
        }
    }
}

module.exports = Signal
