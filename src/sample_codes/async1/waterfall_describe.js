function sample_waterfall(param, callback) {
  var num, text;
  async.waterfall([
    function(next) {
      next(null, 1);
    },
    function(_num, next) {
      num = _num;
      next(null, 'text');
    },
    function(_text, next) {
      text = _text;
      next();
    },
    function(next) {
      next(null, { num: num, text: text });
    }
  ], callback);
}

function sample_waterfall(param, callback) {
  var num, text;
  async.waterfall([
    function(next) {
      getNumber(param, next);
    },
    function(_num, next) {
      num = _num;
      generateText(num, next);
    },
    function(_text, next) {
      text = _text;
      checkNgWord(text, next);
    },
    function(next) {
      next(null, { num: num, text: text });
    }
  ], callback);
}
