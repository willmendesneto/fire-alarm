var CONFIG = require("../src/configuration");

describe("Configuration", () => {
  describe("Temperature information", () => {
    it("should have the sensor port configured", () => {
      CONFIG.FIRE_ALARM.should.have.property("PIN").which.is.a.String();
    });

    it("should have the sensor alarm limit configured", () => {
      CONFIG.FIRE_ALARM.should.have.property("LIMIT").which.is.a.Number();
    });

    it("should have the user phone configured", () => {
      CONFIG.FIRE_ALARM.should.have.property("PHONE_NUMBER").which.is.a.String();
    });
  });

  describe("SMS information", () => {
    it("should have account ssid configured", () => {
      CONFIG.TWILIO.should.have.property("ACCOUNT_SSID").which.is.a.String();
    });

    it("should have auth token configured", () => {
      CONFIG.TWILIO.should.have.property("AUTH_TOKEN").which.is.a.String();
    });

    it("should have the user phone configured", () => {
      CONFIG.TWILIO.should.have.property("PHONE_NUMBER").which.is.a.String();
    });
  });

  it("should have the interval polling information", () => {
    CONFIG.should.have.property("INTERVAL").which.is.a.Number();
  });
});
