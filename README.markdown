async-it
========

`async-it` is a series of **generic asynchronous iterators** for node.js. These iterators are
based on the ES5 additions to `Array` (`forEach`, `map`, `filter`, `some`, `any`, and `reduce`).
`reduceRight` is missing because of async `reduce`'s already unordered nature. Indexes are only
available in the aptly-named `forEachWithIndex` as they are rarely used and would have crowded the
callback's arguments.

Usage
-----
    
See `examples/example.js`:

    var path = require('path'),
        fs = require('fs'),
        asyncIt = require('async-it');

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
      });
    });

    // Hi, I'm foo!
    // Hello World, this is bar.
    // I'm baz.

License
-------

Licensed under the [MIT license][1], Copyright 2010 Tobie Langel.

[1]: http://github.com/tobie/ua-parser/raw/master/LICENSE

