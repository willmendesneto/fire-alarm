var CONFIG = require('../src/configuration');

describe('Configuration', function() {

  describe('Temperature information', function() {

    it('should have the sensor port configured', function(){
      CONFIG.FIRE_ALARM.should.have.property('PIN').which.is.a.String()
    });

    it('should have the sensor alarm limit configured', function(){
      CONFIG.FIRE_ALARM.should.have.property('LIMIT').which.is.a.Number()
    });

    it('should have the user phone configured', function(){
      CONFIG.FIRE_ALARM.should.have.property('PHONE_NUMBER').which.is.a.String()
    });
  });

  describe('SMS information', function() {

    it('should have account ssid configured', function(){
      CONFIG.TWILIO.should.have.property('ACCOUNT_SSID').which.is.a.String()
    });

    it('should have auth token configured', function(){
      CONFIG.TWILIO.should.have.property('AUTH_TOKEN').which.is.a.String()
    });

    it('should have the user phone configured', function(){
      CONFIG.TWILIO.should.have.property('PHONE_NUMBER').which.is.a.String()
    });
  });

  it('should have the interval polling information', function(){
    CONFIG.should.have.property('INTERVAL').which.is.a.Number()
  });

});
