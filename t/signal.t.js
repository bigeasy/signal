require('proof/redux')(3, prove)

function prove (assert) {
    var Vestibule = require('..')
    var vestibule = new Vestibule
    var cookie = vestibule.enter(function () { throw new Error })
    vestibule.enter(function (error, one, two, three) {
        assert([ one, two, three ], [ 1, 2, 3 ], 'called')
    })
    vestibule.leave(cookie)
    vestibule.leave(cookie)
    vestibule.notify(null, 1, 2, 3)
    vestibule.enter(100, function (error, completed) {
        assert(completed, 'timeout canceled')
    })
    vestibule.notify(null, true)
    vestibule.open = [ null, 1 ]
    vestibule.enter(function (error, value) {
        assert(value, 1, 'open')
    })
}
