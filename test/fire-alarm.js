const proxyquire = require("proxyquire");
const CONFIG = require("../src/configuration");
const five = require("johnny-five");
const request = require("request");
const sinon = require("sinon");

let clock = null;
let fireAlarm = null;

describe("FireAlarm", () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox();
    this.createMessagesSpy = this.sandbox.spy();
    const restClientMessage = {
      messages: {
        create: this.createMessagesSpy,
      },
    };

    const FireAlarm = proxyquire("../src/fire-alarm", {
      twilio: () => {
        return restClientMessage;
      },
    });
    fireAlarm = new FireAlarm();
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  it("should have the termometer sensor configured", () => {
    (1 + 1).should.be.equal(2);
    (fireAlarm.temperatureSensor instanceof five.Thermometer).should.be.equal(true);
  });

  describe("#stopPolling", () => {
    beforeEach(() => {
      this.sandbox.spy(global, "clearInterval");
    });

    afterEach(() => {
      fireAlarm.stopPolling();
    });

    it("should remove interval", () => {
      global.clearInterval.calledOnce.should.be.true;
    });
  });

  describe("#toCelsius", () => {
    it("should transform raw voltage to celsius value", () => {
      fireAlarm.temperatureSensor.toCelsius(500.323).should.be.exactly(23);
    });
  });

  describe("#startPolling", () => {
    beforeEach(() => {
      this.piezoPlaySpy = this.sandbox.spy();

      const piezoStub = {
        isPlaying: false,
        play: this.piezoPlaySpy,
      };
      this.sandbox.stub(fireAlarm, "piezo").callsFake(piezoStub);

      this.sandbox.spy(global, "setInterval");
      fireAlarm.startPolling();
    });

    afterEach(() => {
      this.sandbox.restore();
      fireAlarm.stopPolling();
    });

    it("should creates polling", () => {
      global.setInterval.calledOnce.should.be.true;
    });

    describe("When the temperature is up to the limit", () => {
      beforeEach(() => {
        clock = this.sandbox.useFakeTimers();

        this.sandbox.stub(fireAlarm, "temperatureSensor").callsFake({
          celsius: CONFIG.FIRE_ALARM.LIMIT + 1,
        });
        fireAlarm.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(() => {
        clock.restore();
        fireAlarm.stopPolling();
      });

      it("should trigger piezo sensor alarm", () => {
        this.piezoPlaySpy.calledOnce.should.be.true;
      });

      it("should send the SMS to user", () => {
        this.createMessagesSpy.calledOnce.should.be.true;
      });
    });

    describe("When the temperature is NOT up to the limit", () => {
      beforeEach(() => {
        clock = this.sandbox.useFakeTimers();

        this.sandbox.stub(fireAlarm, "temperatureSensor").callsFake({
          celsius: CONFIG.FIRE_ALARM.LIMIT - 1,
        });

        fireAlarm.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(() => {
        clock.restore();
        fireAlarm.stopPolling();
      });

      it("should NOT trigger piezo sensor alarm", () => {
        this.piezoPlaySpy.calledOnce.should.be.false;
      });

      it("should NOT send the SMS to user", () => {
        this.createMessagesSpy.calledOnce.should.be.false;
      });
    });
  });
});
