require('proof')(6, prove)

function prove (okay) {
    var Signal = require('..')
    var signal = new Signal
    var cookie = signal.wait(function () { throw new Error })
    signal.wait(function (error, one, two, three) {
        okay([ one, two, three ], [ 1, 2, 3 ], 'called')
    })
    signal.cancel(cookie)
    signal.cancel(cookie)
    signal.notify(null, 1, 2, 3)
    signal.wait(function (error, value) {
        okay(value, 1, 'unlatch')
    })
    signal.unlatch(null, 1)
    signal.unlatch()
    signal.wait(function (error, value) {
        okay(value, 1, 'open')
    })
    signal = new Signal
    signal.wait(function (error, value) {
        okay(value, 2, 'notify will cancel')
        signal.cancel(cancel)(null, value * 2)
    })
    var cancel = signal.wait(function (error, value) {
        okay(value, 4, 'canceled during notify')
    })
    signal.notify(null, 2)

    var signal = new Signal(function () {
        okay(true, 'constructor wait')
    })
    signal.notify()
}
