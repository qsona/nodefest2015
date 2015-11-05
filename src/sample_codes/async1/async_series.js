function sample_series(param, callback) {
  var num, text;
  async.series([
    function(next) {
      getNumber(param, function(err, _num) {
        if (err) {
          return next(err);
        }
        num = _num;
        next();
      });
    },
    function(next) {
      generateText(num, function(err, _text) {
        if (err) {
          return next(err);
        }
        text = _text;
        next();
      });
    },
    function(next) {
      checkNgWord(text, next);
    }
  ], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { num: num, text: text });
  });
}
