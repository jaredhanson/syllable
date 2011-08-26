var fs = require('fs');
var Bot = require('./bot');
var Message = require('./message');

exports.createBot = function() {
  return new Bot();
};

exports.Bot = Bot;
exports.Message = Message;


exports.interfaces = {};

fs.readdirSync(__dirname + '/interfaces').forEach(function(name) {
  exports.interfaces[name] = function() {
    var module = require('./interfaces/' + name);
    return new module(Array.prototype.slice.call(arguments));
  }
});

exports.__proto__ = exports.interfaces;
