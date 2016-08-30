var CONFIG = require('./configuration');
var request = require('request');
var five = require('johnny-five');
var intervalId = null;

function FireAlarm() {
  this.temperatureSensor = new five.Thermometer({
    pin: CONFIG.FIRE_ALARM.PIN,
    toCelsius: function(rawVoltage) {
      var temperature;
      temperature = Math.log(10000.0*((1024.0/rawVoltage-1)));
      temperature = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * temperature * temperature ))* temperature );
      temperature = temperature - 273.15;            // Convert Kelvin to Celcius
      return Math.floor(temperature);
    }
  });
};

FireAlarm.prototype.stopPolling = function() {
  clearInterval(intervalId);
};

FireAlarm.prototype.startPolling = function() {
  self = this;
  intervalId = setInterval(function() {
    if (self.temperatureSensor.celsius >= CONFIG.FIRE_ALARM.LIMIT) {
      console.log('Up to the limit:', self.temperatureSensor.celsius);
    } else {
      console.log('That\'s ok:', self.temperatureSensor.celsius);
    }
  }, CONFIG.INTERVAL);
};

module.exports = FireAlarm;
