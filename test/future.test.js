describe('future', () => {
    const assert = require('assert')
    const Future = require('../future')
    it('can resolve an empty value', async () => {
        const future = new Future
        future.resolve()
        const result = await future.promise
        assert(result === undefined, 'void')
    })
    it('can resolve value', async () => {
        const future = new Future
        future.resolve(1)
        const result = await future.promise
        assert.equal(result, 1, 'resolve')
    })
    it('can reject', async () => {
        const test = []
        const future = new Future
        future.resolve(new Error('reject'))
        try {
            await future.promise
        } catch (error) {
            test.push(error.message)
        }
        assert.deepStrictEqual(test, [ 'reject' ], 'reject')
    })
    it('can resolve error-first callback style', async () => {
        const future = new Future
        future.resolve(null, 1)
        const result = await future.promise
        assert.equal(result, 1, 'resolve')
    })
    it('can reject error-first callback style', async () => {
        const test = []
        const future = new Future
        future.resolve(new Error('reject'), null)
        try {
            await future.promise
        } catch (error) {
            test.push(error.message)
        }
        assert.deepStrictEqual(test, [ 'reject' ], 'reject')
    })
})
