function sample_plain(param, callback) {
  getNumber(function(err, num) {
    if (err) {
      return callback(err);
    }
    generateText(num, function(err, text) {
      if (err) {
        return callback(err);
      }
      checkNgWord(text, function(err) {
        if (err) {
          return callback(err);
        }
        callback(null, { num: num, text: text });
      });
    });
  });
};
