var Signal = require('../../signal')
var Signal_ = require('../../_signal')
var Benchmark = require('benchmark')

var suite = new Benchmark.Suite('call')

function fn () {
    return function () { new Signal(function () {}) }
}

function fn_ () {
    return function () { new Signal_(function () {}) }
}

for (var i = 1; i <= 4; i++)  {
    suite.add({
        name: ' signal new ' + i,
        fn: fn()
    })

    suite.add({
        name: '_signal new ' + i,
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
