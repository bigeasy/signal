describe('latch', () => {
    const assert = require('assert')
    const Latch = require('../latch')
    it('can invoke on resolve', async () => {
        let _resolve = null
        const test = []
        const promise = new Promise(resolve => _resolve = resolve)
        const latch = new Latch().then(promise)
        latch.await((error, result) => test.push({ error, result }))
        _resolve(1)
        await promise
        assert.deepStrictEqual(test, [{ error: null, result: 1 }], 'invoked')
    })
    it('can invoke on reject', async () => {
        let _reject = null
        const test = []
        const promise = new Promise((resolve, reject) => _reject = reject)
        const latch = new Latch().then(promise)
        latch.await((error, result) => test.push(error.message))
        _reject(new Error('error'))
        try {
            await promise
        } catch (error) {
        }
        assert.deepStrictEqual(test, [ 'error' ], 'invoked')
    })
    it('can await reject', async () => {
        let _reject = null
        const test = []
        const promise = new Promise((resolve, reject) => _reject = reject)
        const latch = new Latch().then(promise)
        latch.await((error, result) => test.push(error.message))
        _reject(new Error('error'))
        try {
            await promise
        } catch (error) {
        }
        assert.deepStrictEqual(test, [ 'error' ], 'invoked')
    })
    it('can invoke a callback immediately after unlatch', () => {
        const test = []
        const latch = new Latch()
        latch.unlatch(null, 1)
        latch.await((error, result) => test.push({ error, result }))
        assert.deepStrictEqual(test, [{ error: null, result: 1 }], 'invoked')
    })
    it('can invoke a callback immediately after unlatch', () => {
        const test = []
        const latch = new Latch()
        latch.unlatch(null, 1)
        latch.await((error, result) => test.push({ error, result }))
        assert.deepStrictEqual(test, [{ error: null, result: 1 }], 'invoked')
    })
    it('can cancel a callback', () => {
        const test = []
        const latch = new Latch()
        latch.await((error, result) => test.push({ error, result }))
        const f = latch.await((error, result) => test.push({ error, result }))
        assert(latch.cancel(f) === f, 'cancel')
        assert(latch.cancel(f) === null, 'cancel not found')
        latch.unlatch(null, 1)
        assert.deepStrictEqual(test, [{ error: null, result: 1 }], 'invoked')
    })
})
