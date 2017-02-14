require('proof/redux')(4, prove)

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
    signal.open = [ null, 1 ]
    signal.wait(function (error, value) {
        assert(value, 1, 'open')
    })
}
