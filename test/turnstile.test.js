describe('turnstile', () => {
    const assert = require('assert')
    const Turnstile = require('../turnstile')
    it('can be constructed', () => {
        assert(new Turnstile != null, 'constructed')
    })
    it('can send waiters through the turnstile', async () => {
        const turnstile = new Turnstile
        const promise = turnstile.enter()
        turnstile.twist(1)
        assert.equal(await promise, 1, 'through')
        turnstile.twist(1)
    })
})
