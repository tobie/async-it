"use strict";

var _slice = Array.prototype.slice;

function nextTick(callback) {
  var args = _slice.call(arguments, 1);
  process.nextTick(function() {
    callback.apply(null, args);
  });
}

exports.forEach = forEach;
function forEach(iterable, iterator, context, callback) {
  var counter = 0,
      notified = false;
  
  function cont(err) {
    if (notified) { return; }
    
    if (err) {
      notified = true;
      nextTick(callback, err);
      return;
    }
    
    if (counter == 0) {
      nextTick(callback, null, iterable);
      return;
    }
    
    counter--;
  }
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  for (var i = 0, len = iterable.length; i < len; i++) {
    if (i in iterable) {
      counter++;
      iterator.call(context, iterable[i], cont);
    }
  }
  
  cont();
}

exports.forEachWithIndex = forEachWithIndex;
function forEachWithIndex(iterable, iterator, context, callback) {
  var counter = iterable.length,
      notified = false;
  
  function cont(err) {
    counter--;
    
    if (notified) { return; }
    
    if (err) {
      notified = true;
      callback(err);
    } else if (counter == 0) {
      callback(null, iterable);
    }
  }
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!iterable.length) {
      callback(null, iterable);
    } else {
      for (var i = 0, len = iterable.length; i < len; i++) {
        if (i in iterable) {
          iterator.call(context, iterable[i], i, cont);
        }
      }
    }
  });
}

exports.map = map;
function map(iterable, iterator, context, callback) {
  var counter = iterable.length,
      notified = false,
      output = [];
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!iterable.length) {
      callback(null, output);
      return;
    }
    
    for (var i = 0, len = iterable.length; i < len; i++) {
      if (i in iterable) {
        (function(item, i) {
          
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
        })(iterable[i], i);
      }
    }
  });
}

exports.every = every;
function every(iterable, iterator, context, callback) {
  var counter = iterable.length,
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
    if (!iterable.length) {
      callback(null, true);
    } else {
      for (var i = 0, len = iterable.length; i < len; i++) {
        if (i in iterable) {
          iterator.call(context, iterable[i], cont);
        }
      }
    }
  });
}

exports.some = some;
function some(iterable, iterator, context, callback) {
  var counter = iterable.length,
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
    if (!iterable.length) {
      callback(null, false);
    } else {
      for (var i = 0, len = iterable.length; i < len; i++) {
        if (i in iterable) {
          iterator.call(context, iterable[i], cont);
        }
      }
    }
  });
}

exports.filter = filter;
function filter(iterable, iterator, context, callback) {
  var counter = iterable.length,
      notified = false,
      clone = _slice.call(iterable, 0),
      successIndexes = [],
      output = [];
  
  if (!callback) {
    callback = context;
    context = null;
  }
  
  process.nextTick(function() {
    if (!iterable.length) {
      callback(null, output);
      return;
    }
    
    for (var i = 0, len = iterable.length; i < len; i++) {
      if (i in iterable) {
        (function(item, i) {
            function cont(err, result) {
              counter--;
              if (result) { successIndexes.push(i); }
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
            }
            
            iterator.call(context, item, cont);
        })(iterable[i], i);
      }
    }
  });
}