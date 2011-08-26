var util = require('util');

function MustOverrideError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'MustOverrideError';
  this.message = message || null;
};

util.inherits(MustOverrideError, Error);


module.exports = MustOverrideError;
