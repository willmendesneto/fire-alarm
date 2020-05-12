const FireAlarm = require("./fire-alarm");
const five = require("johnny-five");
const board = new five.Board();

board.on("ready", () => {
  fireAlarm = new FireAlarm();
  fireAlarm.startPolling();
});
