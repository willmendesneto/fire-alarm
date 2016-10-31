var proxyquire = require('proxyquire');
var CONFIG = require('../src/configuration');
var five = require('johnny-five');
var request = require('request');
var sinon = require('sinon');

describe('FireAlarm', function() {

  beforeEach(function(){
    this.sandbox = sinon.sandbox.create();
    this.createMessagesSpy = this.sandbox.spy();
    var restClientMessage = {
      messages: {
        create: this.createMessagesSpy
      }
    };

    twilioMock = {
      RestClient: function() {
        return restClientMessage
      }
    };

    var FireAlarm = proxyquire('../src/fire-alarm', {
      twilio: twilioMock
    });
    fireAlarm = new FireAlarm();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should have the termometer sensor configured', function(){
    (fireAlarm.temperatureSensor instanceof five.Thermometer).should.be.equal(true);
  });

  describe('#stopPolling', function(){
    beforeEach(function(){
      this.sandbox.spy(global, 'clearInterval');
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
      this.piezoPlaySpy = this.sandbox.spy();

      var piezoStub = {
        isPlaying: false,
        play: this.piezoPlaySpy
      };
      this.sandbox.stub(fireAlarm, 'piezo', piezoStub);

      this.sandbox.spy(global, 'setInterval');
      fireAlarm.startPolling();
    });

    afterEach(function(){
      global.setInterval.restore();
    });

    it('should creates polling', function(){
      global.setInterval.calledOnce.should.be.true;
    });

    describe('When the temperature is up to the limit', function(){

      beforeEach(function() {
        clock = this.sandbox.useFakeTimers();

        this.sandbox.stub(fireAlarm, 'temperatureSensor', {
          celsius: CONFIG.FIRE_ALARM.LIMIT + 1
        });
        fireAlarm.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.restore();
      });

      it('should trigger piezo sensor alarm', function(){
        this.piezoPlaySpy.calledOnce.should.be.true;
      });

      it('should send the SMS to user', function() {
        this.createMessagesSpy.calledOnce.should.be.true;
      });

    });

    describe('When the temperature is NOT up to the limit', function(){

      beforeEach(function() {
        clock = this.sandbox.useFakeTimers();

        this.sandbox.stub(fireAlarm, 'temperatureSensor', {
          celsius: CONFIG.FIRE_ALARM.LIMIT - 1
        });

        fireAlarm.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.restore();
      });

      it('should NOT trigger piezo sensor alarm', function(){
        this.piezoPlaySpy.calledOnce.should.be.false;
      });

      it('should NOT send the SMS to user', function() {
        this.createMessagesSpy.calledOnce.should.be.false;
      });

    });

  });

});
