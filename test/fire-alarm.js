var FireAlarm = require('../src/fire-alarm');
var CONFIG = require('../src/configuration');
var five = require('johnny-five');
var request = require('request');
var sinon = require('sinon');
var clock = null;

describe('FireAlarm', function() {

  var sandbox;

  beforeEach(function(){
    fireAlarm = new FireAlarm();
    sandbox = sinon.sandbox.create();
  });

  it('should have the termometer sensor configured', function(){
    (fireAlarm.temperatureSensor instanceof five.Thermometer).should.be.equal(true);
  });

  describe('#stopPolling', function(){
    beforeEach(function(){
      sandbox.spy(global, 'clearInterval');
      fireAlarm.stopPolling();
    });

    it('should remove interval', function(){
      global.clearInterval.calledOnce.should.be.true;
    });
  });


  describe('#toCelsius', function(){
    it('should transform raw voltage to celsius value', function(){
      fireAlarm.temperatureSensor.toCelsius(500.323).should.be.exactly(23);
    });
  });

  describe('#startPolling', function(){
    beforeEach(function(){
      sandbox.spy(global, 'setInterval');
      fireAlarm.startPolling();
    });

    afterEach(function(){
      global.setInterval.restore();
    });

    it('should creates polling', function(){
      global.setInterval.calledOnce.should.be.true;
    });

    describe('When the temperature is up to the limit', function(){
      var piezoPlaySpy = null;

      beforeEach(function() {
        clock = sandbox.useFakeTimers();
        var celsiusStub = {
          celsius: CONFIG.FIRE_ALARM.LIMIT + 1
        };
        piezoPlaySpy = sinon.spy();
        var piezoStub = {
          isPlaying: false,
          play: piezoPlaySpy
        };

        sandbox.stub(fireAlarm, 'temperatureSensor', celsiusStub);
        sandbox.stub(fireAlarm, 'piezo', piezoStub);
        fireAlarm.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.restore();
      });

      it('should trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.true;
      });

    });

  });

});
