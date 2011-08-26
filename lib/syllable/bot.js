var util = require('util');
var assert = require('assert');
var Handler = require('./handler');
var MustOverrideError = require('./mustoverrideerror');

function Bot() {
  this._handlers = [];
  this._interfaces = [];
}

Bot.prototype.hear = function(regexp, fn) {
  var middleware = [];

  // slice middleware
  // @todo: Implement this
  /*
  if (arguments.length > 3) {
    middleware = toArray(arguments, 2);
    fn = middleware.pop();
    middleware = utils.flatten(middleware);
  }
  */

  // ensure path and callback are given
  // @todo: Implement this
  /*
  if (!path) throw new Error(action + 'route requires a path');
  if (!fn) throw new Error(action + ' route ' + path + ' requires a callback');
  */
  
  var handler = new Handler(regexp, fn, {
    middleware: middleware
  });

  this._handlers.push(handler);
  return this;
}

Bot.prototype.listen = function() {
  this._interfaces.forEach(function(iface) {
    iface.open();
  });
}

Bot.prototype.interface = function(iface) {
  this._interfaces.push(iface);
  iface.on('message', this._dispatch.bind(this));
}

Bot.prototype._dispatch = function(message) {
  var stack = this._handlers;
  var idx = 0;
  
  function next(err) {
    var handler = stack[idx++];
    
    // all done
    if (!handler) {
      // TODO: Ignore the message.
      return;
    }
    
    try {
      if (!handler.match(message)) { return next(err); }
      handler.handle(message, next);
    } catch (e) {
      if (e instanceof MustOverrideError || e instanceof assert.AssertionError) {
        console.error(e.stack + '\n');
        next(e);
      } else {
        // TODO: Reply with an error message.
        console.error(e.stack + '\n');
        next(e);
      }
    }
  }
  next();
}


module.exports = Bot;
