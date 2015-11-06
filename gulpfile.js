var _ = require('lodash');
var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('server', function () {
  gulp.src('src')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

var express = require('express');
var app = express();
var http = require('http').Server(app);

['js', 'img', 'css', 'fonts'].forEach(function(dir) {
  app.use('/' + dir, express.static('src/' + dir));
});

app.get('/*.md', function(req, res) {
  res.sendfile('src' + req.url);
});

app.get('/', function(req, res) {
  res.sendfile('src/index.html');
});

http.listen(8000);
