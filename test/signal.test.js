describe('signal', () => {
    const assert = require('assert')
    it('can signal', () => {
        var Signal = require('..')
        var signal = new Signal
        signal.notify()
        var cookie = signal.wait(function () { throw new Error })
        signal.wait(function (error, one, two, three) {
            assert.deepStrictEqual([ one, two, three ], [ 1, 2, 3 ], 'called')
        })
        signal.cancel(cookie)
        signal.cancel(cookie)
        signal.notify(null, 1, 2, 3)
        signal.wait(function (error, value) {
            assert.equal(value, 1, 'unlatch')
        })
        signal.unlatch(null, 1)
        signal.unlatch()
        signal.wait(function (error, value) {
            assert.equal(value, 1, 'open')
        })
        signal = new Signal
        signal.wait(function (error, value) {
            assert.equal(value, 2, 'notify will cancel')
            signal.cancel(cancel)(null, value * 2)
        })
        var cancel = signal.wait(function (error, value) {
            assert.equal(value, 4, 'canceled during notify')
        })
        signal.notify(null, 2)

        const test = []
        var signal = new Signal(function () { test.push('constructor wait') })
        signal.notify()

        var nested = new Signal(function () {
            nested.wait(function () { test.push('nested') })
            nested.notify()
        })
        nested.notify()
        assert.deepStrictEqual(test, [ 'constructor wait', 'nested' ], 'test')
    })
})
