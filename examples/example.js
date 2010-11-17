var path = require('path'),
    fs = require('fs'),
    asyncIt = require('../index');

var files = ['foo.txt', 'bar.txt', 'does-not-exist.txt', 'baz.txt'];
files = files.map(function(file) {
  return path.join(__dirname, 'files', file);
});

// select existing files
asyncIt.filter(files, function(file, cont) {
  path.exists(file, function(exists) {
    cont(null, exists);
  });
}, function(err, existingFiles) {
  // collect their content
  asyncIt.map(existingFiles, function(file, cont) {
    fs.readFile(file, 'utf8', cont);
  }, function(err, content) {
    // output the ordered content to the console
    console.log(content.join('\n'));
  })
});