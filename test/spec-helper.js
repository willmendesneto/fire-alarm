require("should");
const mockFirmata = require("mock-firmata");
const five = require("johnny-five");

const Board = five.Board;
const board = new Board({
  io: new mockFirmata.Firmata(),
  debug: false,
  repl: false,
});
