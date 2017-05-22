
/**
 * Event - Event Class
 *
 * @param  {type} payloadInput Payload required for initializing a new Event
 * @return {type}              description
 */
const Event = function Event(payloadInput) {
  const payloadDefault = {
    name: '',
    frequency: null,
    limit: 1,
    payloadCB: [],
    listeners: [],
    unit: Event.MIN,
  };

  const payloadOverride = {
    countExecuted: 0,
    nextTriggerOn: null,
    triggerCount: 0,
  };

  const payload = Object.assign({}, payloadDefault, payloadInput, payloadOverride);
  // const self = this;

  /**
   * resetTriggerOn - resets internal trigger counter
   *
   * @return {undefined}  description
   * @private
   */
  function resetTriggerOn() {
    payload.nextTriggerOn = payload.frequency * payload.unit;
  }

  function init() {
    resetTriggerOn();
  }

  this.every = function every(value, unit) {
    payload.frequency = value * unit;
    payload.unit = unit;
    payload.limit = 0;
    resetTriggerOn();
    // console.log(payload);
    return this;
  };

  this.daily = function daily() {
    return this.every(1, Event.DAY);
  };

  this.once = function once() {
    payload.limit = 1;
    return this;
  };

  this.repeat = function repeat(limit) {
    if (limit) {
      payload.limit = limit;
    } else {
      payload.limit = 0;
    }
  };

  this.pollReady = function pollReady(pollingTime) {
    if (payload.limit !== 0 && payload.triggerCount === payload.limit) {
      return false;
    }
    payload.nextTriggerOn -= pollingTime;
    if (payload.nextTriggerOn <= 0) {
      resetTriggerOn();
      return true;
    }
    return false;
  };


  this.on = function on(callback, payloadCBInput) {
    let payloadCB = {};
    if (payloadCBInput) {
      payloadCB = payloadCBInput;
    }
    payload.listeners.push({
      callback,
      payloadCB,
    });
    // console.log(payload);
    return this;
  };

  this.addListener = this.on;

  this.removeAllListeners = function removeAllListeners() {
    payload.listeners = [];
    return this;
  };

  this.getName = function getName() {
    return payload.name;
  };

  this.emit = function emit() {
    resetTriggerOn();
    payload.triggerCount += 1;
    payload.listeners.forEach((listener) => {
      listener.callback(Object.assign({}, payload.payloadCB, listener.payloadCB));
    });
  };

  this.getTriggerCount = function getTriggerCount() {
    return payload.triggerCount;
  };

  init();
};

Event.MIN = 60;
Event.SEC = 1;
Event.HOUR = 60 * 60;
Event.DAY = 24 * 60 * 60;

module.exports = Event;
