var asyncblock = require('asyncblock');

function sample_asyncblock(param, callback) {
  asyncblock(function(flow) {
    flow.errorCallback = callback;

    var x = getX(param).defer();
    if (x) {
      var y = getY().defer();
      var z = getZ().defer();
      doSomething(y, z).sync();
    }
    callback(null, getW(x).sync());
  });
}
