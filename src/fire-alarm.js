var CONFIG = require('./configuration');
var request = require('request');
var five = require('johnny-five');
var twilio = require('twilio');
var intervalId = null;

var client = new twilio.RestClient(CONFIG.TWILIO.ACCOUNT_SSID, CONFIG.TWILIO.AUTH_TOKEN);

function FireAlarm() {
  this.piezo = new five.Piezo(3);
  this.temperatureSensor = new five.Thermometer({
    pin: CONFIG.FIRE_ALARM.PIN,
    toCelsius: function(rawVoltage) {
      var temperature = 0;
      temperature = Math.log(10000.0*((1024.0/rawVoltage-1)));
      temperature = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * temperature * temperature ))* temperature );
      // Convert Kelvin to Celcius
      temperature = temperature - 273.15;
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
    if (self.temperatureSensor.celsius >= CONFIG.FIRE_ALARM.LIMIT && !self.piezo.isPlaying) {

      self.piezo.play({
        song: [
          ['G5', 1/4],
          [null, 7/4]
        ],
        tempo: 200
      });

      client.messages.create({
        body: 'Something is wrong with your fire alarm. Please, call the local fire brigade.',
        to: CONFIG.FIRE_ALARM.PHONE_NUMBER,
        from: CONFIG.TWILIO.PHONE_NUMBER
      });

      console.log('Up to the limit:', self.temperatureSensor.celsius);
    } else {
      console.log('That\'s ok:', self.temperatureSensor.celsius);
    }

  }, CONFIG.INTERVAL);
};

module.exports = FireAlarm;
