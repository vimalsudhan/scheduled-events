const Event = require('./event');

/**
 * Manager - Events Manager class
 * @class Manager
 * @classdesc Manages event based on scheduling criteria & occurences
 * @return {Manager}  instance of manager
 */
const Manager = function Manager() {
  const events = {};
  let currentFrequency = Event.MIN;
  let pollingTimer;
  const self = this;

  /**
   * poll - description
   *
   * @private
   * @return {type}  description
   */
  function poll() {
    const lapsed = currentFrequency;

    Object.keys(events).forEach((eventName) => {
      const event = events[eventName];
      if (event.pollReady(lapsed)) {
        event.emit();
      }
    });
  }

  function init() {
    self.setFrequency(currentFrequency);
  }

  this.addEvent = function addEvent(event) {
    events[event.getName()] = event;
  };

  this.setFrequency = function setFrequency(frequency) {
    currentFrequency = frequency;
    if (pollingTimer) {
      clearInterval(pollingTimer);
    }

    pollingTimer = setInterval(poll, frequency * 1000);
  };

  this.emit = function emit(eventName) {
    events[eventName].emit();
  };

  init();
};


module.exports = Manager;
