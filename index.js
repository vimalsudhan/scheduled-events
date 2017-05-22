require('log-with-console');

const Event = require('./lib/event');
const Manager = require('./lib/manager');

const manager = new Manager();

const self = {

  units: {
    SEC: Event.SEC,
    MIN: Event.MIN,
  },

  newEvent: function newEvent(eventName, payloadCB) {
    const eventPayload = {
      name: eventName,
    };
    if (payloadCB) {
      eventPayload.payloadCB = payloadCB;
    }
    const event = new Event(eventPayload);
    manager.addEvent(event);
    return event;
  },

  emit: manager.emit,

  setFrequency: manager.setFrequency,
};

module.exports = self;
