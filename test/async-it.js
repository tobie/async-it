var assert = require('assert'),
    async = require('../lib/parallel');

var EMPTY = [];
var ARR = [0, 1, 2, 3, 4];
var SPARSE_ARR = new Array(10);
SPARSE_ARR[0] = 0;
SPARSE_ARR[1] = 1
SPARSE_ARR[2] = 2
SPARSE_ARR[3] = 3
SPARSE_ARR[4] = 4

function noopCallback(item, callback) { callback(); }
function errorCallback(item, callback) { callback(new Error('Simulated Iterator Error')); }

suite('forEach', function() {
  test('final callback is called once with empty arrays', function(done) {
    async.forEach(EMPTY, noopCallback, done);
  });
  
  test('final callback is called once with non-empty arrays', function(done) {
    async.forEach(ARR, noopCallback, done);
  });
  
  test('final callback is called once with sparse arrays', function(done) {
    async.forEach(SPARSE_ARR, noopCallback, done);
  });
  
  test('final callback is called once, even when there are multiple errors', function(done) {
    async.forEach(ARR, errorCallback, function(err) {
      assert(err);
      done();
    });
  });
  
  test('final callback is always called on a next tick.', function(done) {
    var bool = false;
    async.forEach(EMPTY, noopCallback, function() {
      assert(bool);
      done();
    });
    bool = true;
  });
  
  test('iterator callbacks are called synchronously.', function(done) {
    var bool = false;
    async.forEach(ARR, function(item, callback) {
      assert(!bool);
      callback();
    }, done);
    bool = true;
  });
});

