function Handler(regexp, fn, options) {
  options = options || {};
  this.regexp = regexp;
  //this.regexp = normalize(regexp);
  this.callback = fn;
  this.middleware = options.middleware;
}

Handler.prototype.match = function(message) {
  return this.regexp.test(message.body);
};

//Handler.prototype.match = function(message) {
//  return this.regexp.exec(message);
//};

Handler.prototype.handle = function(message, next) {
  var self = this;
  var idx = 0;
  
  function middleware(err) {
    var fn = self.middleware[idx++];
    if ('handler' == err) {
      next();
    } else if (err) {
      next(err);
    } else if (fn) {
      fn(stanza, middleware);
    } else {
      self.callback.call(self, message, next);
    }
  };
  middleware();
};

function normalize(exp) {
  if (exp instanceof RegExp) return exp;
  return new RegExp(exp);
}


module.exports = Handler;
