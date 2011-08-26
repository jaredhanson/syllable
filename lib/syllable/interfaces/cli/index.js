var events = require('events');
var util = require('util');
var Message = require('./message');

function CLI() {
  events.EventEmitter.call(this);
};

util.inherits(CLI, events.EventEmitter);

CLI.prototype.open = function() {
  var self = this;
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    self.emit('message', new Message(chunk.trim()));
  });
}


module.exports = CLI;
