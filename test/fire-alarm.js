var FireAlarm = require('../src/fire-alarm');
var CONFIG = require('../src/configuration');
var five = require('johnny-five');
var request = require('request');
var sinon = require('sinon');
var clock = null;

describe('FireAlarm', function() {

  beforeEach(function(){
    fireAlarm = new FireAlarm();
  });

  it('should have the termometer sensor configured', function(){
    (fireAlarm.temperatureSensor instanceof five.Temperature).should.be.equal(true);
  });

  describe('#stopPolling', function(){
    beforeEach(function(){
      sinon.spy(global, 'clearInterval');
      fireAlarm.stopPolling();
    });

    it('should remove interval', function(){
      global.clearInterval.calledOnce.should.be.true;
    });
  });

  describe('#startPolling', function(){
    beforeEach(function(){
      sinon.spy(global, 'setInterval');
      fireAlarm.startPolling();
    });

    afterEach(function(){
      global.setInterval.restore();
    });

    it('should creates polling', function(){
      global.setInterval.calledOnce.should.be.true;
    });
  });

});
