var FireAlarm = require('./fire-alarm');
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  fireAlarm = new FireAlarm();
  fireAlarm.startPolling();
});
