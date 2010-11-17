exports.forEach = forEach;
function forEach(array, iterator, context, callback) {
  var counter = array.length,
      notified = false;
  
  function cont(err) {
    counter--;
    
    if (notified) { return; }
    
    if (err) {
      notified = true;
      callback(err);
    } else if (counter == 0) {
      callback(null, array);
    }
  }
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, array);
    } else {
      array.forEach(function(item) {
        iterator.call(context, item, cont);
      });
    }
  });
}

exports.forEachWithIndex = forEachWithIndex;
function forEachWithIndex(array, iterator, context, callback) {
  var counter = array.length,
      notified = false;
  
  function cont(err) {
    counter--;
    
    if (notified) { return; }
    
    if (err) {
      notified = true;
      callback(err);
    } else if (counter == 0) {
      callback(null, array);
    }
  }
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, array);
    } else {
      array.forEach(function(item, i) {
        iterator.call(context, item, i, cont);
      });
    }
  });
}

exports.map = map;
function map(array, iterator, context, callback) {
  var counter = array.length,
      notified = false,
      output = [];
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, output);
      return;
    }
    
    array.forEach(function(item, i) {
      function cont(err, result) {
        counter--;
        output[i] = result;
        
        if (notified) { return; }
        
        if (err) {
          notified = true;
          callback(err);
        } else if (counter == 0) {
          callback(null, output);
        }
      }
      
      iterator.call(context, item, cont);
    });
  });
}

exports.every = every;
function every(array, iterator, context, callback) {
  var counter = array.length,
      notified = false;

  function cont(err, result) {
    counter--;
    
    if (notified) { return; }
    
    if (err) {
      notified = true;
      callback(err);
    } else if (!result) {
      notified = true;
      callback(null, false);
    } else if (counter == 0) {
      callback(null, true);
    }
  }

  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, true);
    } else {
      array.forEach(function(item) {
        iterator.call(context, item, cont);
      });
    }
  });
}

exports.some = some;
function some(array, iterator, context, callback) {
  var counter = array.length,
      notified = false;

  function cont(err, result) {
    counter--;
    
    if (notified) { return; }
    
    if (err) {
      notified = true;
      callback(err);
    } else if (result) {
      notified = true;
      callback(null, true);
    } else if (counter == 0) {
      callback(null, false);
    }
  }

  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, false);
    } else {
      array.forEach(function(item) {
        iterator.call(context, item, cont);
      });
    }
  });
}

exports.filter = filter;
function filter(array, iterator, context, callback) {
  var counter = array.length,
      notified = false,
      clone = array.slice(0),
      successIndexes = [],
      output = [];
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, output);
      return;
    }
    
    array.forEach(function(item, index) {
      iterator.call(context, item, function(err, result) {
        counter--;
        if (result) { successIndexes.push(index); }
        if (notified) { return; }
        
        if (err) {
          notified = true;
          callback(err);
        } else if (counter == 0) {
          successIndexes.sort(function(a, b) {
            return a > b;
          });
          successIndexes.forEach(function(i) {
            output.push(clone[i]);
          });
          callback(null, output);
        }
      });
    });
  });
}

exports.reduce = reduce;
function reduce(array, iterator, accumulator, callback) {
  var counter = array.length,
      notified = false;

  function cont(err, result) {
    counter--;
    accumulator = result;

    if (notified) { return; }

    if (err) {
      notified = true;
      callback(err);
    } else if (counter == 0) {
      callback(null, accumulator);
    }
  }

  
  if (!callback) {
    callback = accumulator;
    accumulator = (void 0);
  }
  
  process.nextTick(function() {
    if (!array.length) {
      callback(null, accumulator);
    } else {
      array.forEach(function(item) {
        iterator(accumulator, item, cont);
      });
    }
  });
}