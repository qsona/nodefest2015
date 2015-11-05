function sample_sync(param) {
  var x = getX(param);
  if (x) {
    var y = getY();
    var z = getZ();
    doSomething(y, z);
  }
  return getW(x);
}
