require('proof')(1, prove)

function prove (assert) {
    var Vestibule = require('../..')
    var vestibule = new Vestibule
    var cookie = vestibule.enter(function () { throw new Error })
    vestibule.enter(function (one, two, three) {
        assert([ one, two, three ], [ 1, 2, 3 ], 'called')
    })
    vestibule.leave(cookie)
    vestibule.leave(cookie)
    vestibule.notify(1, 2, 3)
}
