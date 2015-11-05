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
