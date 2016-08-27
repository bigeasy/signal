require('proof')(2, prove)

function prove (assert) {
    var Vestibule = require('..')
    var vestibule = new Vestibule
    var cookie = vestibule.enter(function () { throw new Error })
    vestibule.enter(function (one, two, three) {
        assert([ one, two, three ], [ 1, 2, 3 ], 'called')
    })
    vestibule.leave(cookie)
    vestibule.leave(cookie)
    vestibule.notify(1, 2, 3)
    vestibule.open = [ null, 1 ]
    vestibule.enter(function (error, value) {
        assert(value, 1, 'open')
    })
}
