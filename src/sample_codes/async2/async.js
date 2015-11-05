var async = require('neo-async');

function sample_async(param, callback) {
  var x;
  async.angelFall([
    function(next) {
      getX(param, next);
    },
    function(_x, next) {
      x = _x;
      if (!x) {
        return next();
      }
      async.parallel({
        y: getY,
        z: getZ
      }, next);
    },
    function(result, next) {
      if (!x) {
        return next();
      }
      doSomething(result.y, result.z, next);
    },
    function(next) {
      getW(x, next):
    }
  ], callback);
}
