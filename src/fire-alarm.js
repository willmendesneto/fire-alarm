var CONFIG = require('./configuration');
var request = require('request');
var five = require('johnny-five');
var intervalId = null;

function FireAlarm() {
  this.temperatureSensor = new five.Temperature({
    controller: CONFIG.FIRE_ALARM.TYPE,
    pin: CONFIG.FIRE_ALARM.PIN
  });
};

FireAlarm.prototype.stopPolling = function() {
  clearInterval(intervalId);
};

FireAlarm.prototype.startPolling = function() {
  self = this;
  intervalId = setInterval(function() {
    console.log('Temperature:', self.temperatureSensor.celsius);
  }, CONFIG.INTERVAL);
};

module.exports = FireAlarm;
