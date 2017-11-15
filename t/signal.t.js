require('proof')(8, prove)

function prove (assert) {
    var Signal = require('..')
    var signal = new Signal
    var cookie = signal.wait(function () { throw new Error })
    signal.wait(function (error, one, two, three) {
        assert([ one, two, three ], [ 1, 2, 3 ], 'called')
    })
    signal.cancel(cookie)
    signal.cancel(cookie)
    signal.notify(null, 1, 2, 3)
    signal.wait(100, function (error, completed) {
        assert(completed, 'timeout canceled')
    })
    signal.notify(null, true)
    var cookie = signal.wait(1, function () { assert(true, 'timer canceled') })
    signal.cancel(cookie)()
    signal.wait(function (error, value) {
        assert(value, 1, 'unlatch')
    })
    signal.unlatch(null, 1)
    signal.unlatch()
    signal.wait(function (error, value) {
        assert(value, 1, 'open')
    })
    signal = new Signal
    signal.wait(function (error, value) {
        assert(value, 2, 'notify will cancel')
        signal.cancel(cancel)(null, value * 2)
    })
    var cancel = signal.wait(function (error, value) {
        assert(value, 4, 'canceled during notify')
    })
    signal.notify(null, 2)

    var first = new Signal
    var second = new Signal

    Signal.first(first, second, function (error, value) {
        assert(value, 2, 'second')
    })
    second.unlatch(null, 2)
    first.unlatch(null, 1)
}
