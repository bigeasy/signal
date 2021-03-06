var Signal = require('../../signal')
var Signal_ = require('../../_signal')
var Benchmark = require('benchmark')

var suite = new Benchmark.Suite('call')

function fn () {
    return function () {
        new Signal().notify(null, 1, 2, 3, 4, 5)
    }
}

function fn_ () {
    return function () {
        new Signal_().notify(null, 1, 2, 3, 4, 5)
    }
}

for (var i = 1; i <= 4; i++)  {
    suite.add({
        name: ' signal notify ' + i,
        fn: fn()
    })

    suite.add({
        name: '_signal notify ' + i,
        fn: fn_()
    })
}

suite.on('cycle', function(event) {
    console.log(String(event.target));
})

suite.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})

suite.run()
