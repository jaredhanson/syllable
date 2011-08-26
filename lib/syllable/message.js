var MustOverrideError = require('./mustoverrideerror');

function Message(body) {
  if (typeof body === 'object') {
    this.subject = body.subject;
    this.body = body.body;
  } else {
    this.body = body;
  }
}

Message.prototype.reply = function(message) {
  message = (typeof message === 'string') ? new Message(message) : message;
  this.send(message);
};

Message.prototype.ignore = function() {
  this.send();
};

Message.prototype.send = function(message) {
  throw new MustOverrideError('Message#send must be overridden by a subclass.');
};

module.exports = Message;
