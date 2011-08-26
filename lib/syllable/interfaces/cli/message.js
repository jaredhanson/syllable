var util = require('util');
var SuperMessage = require('../../message');

function Message() {
  SuperMessage.apply(this, arguments);
};

util.inherits(Message, SuperMessage);

Message.prototype.send = function(message) {
  if (!message) { return; }
  process.stdout.write(message.body + '\n');
}


module.exports = Message;
