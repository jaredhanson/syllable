function Handler(regexp, fn, options) {
  options = options || {};
  this.regexp = normalize(regexp
    , this.keys = []
    , options.sensitive
    , options.strict);
  this.callback = fn;
  this.middleware = options.middleware;
}

Handler.prototype.match = function(message) {
  this._captures = this.regexp.exec(message.body);
  return this._captures;
};

Handler.prototype.handle = function(message, next) {
  var self = this;
  var idx = 0
    , keys
    , captures;
  
  keys = this.keys;
  captures = this._captures;
  message.params = [];

  // params from capture groups
  for (var j = 1, jlen = captures.length; j < jlen; ++j) {
    var key = keys[j-1]
      , val = captures[j];
    if (key) {
      message.params[key.name] = val;
    } else {
      message.params.push(val);
    }
  }
  
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

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 */

function normalize(path, keys, sensitive, strict) {
  if (path instanceof RegExp) return path;
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || '([^/]+?)') + ')'
        + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.+)');
  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}


module.exports = Handler;
