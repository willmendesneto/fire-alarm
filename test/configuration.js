var CONFIG = require('../src/configuration');

describe('Configuration', function() {

  describe('Temperature information', function() {
    it('should have the sensor type configured', function(){
      CONFIG.FIRE_ALARM.should.have.property('TYPE').which.is.a.String()
    });

    it('should have the sensor port configured', function(){
      CONFIG.FIRE_ALARM.should.have.property('PIN').which.is.a.Number()
    });

    it('should have the sensor alarm limit configured', function(){
      CONFIG.FIRE_ALARM.should.have.property('LIMIT').which.is.a.Number()
    });
  });

  it('should have the interval polling information', function(){
    CONFIG.should.have.property('INTERVAL').which.is.a.Number()
  });

});
