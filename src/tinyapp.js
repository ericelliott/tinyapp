var $ = require('jquery-browserify'),
  EventEmitter2 = require('eventemitter2').EventEmitter2,
  underscore = require('underscore'),
  bb = require('backbone-browserify'),

  extend = underscore.extend,
  events = new EventEmitter2(),
  deferred = function deferred() {
    return new $.Deferred();
  },

  renderReady = deferred(),

  trigger = function trigger() {
    var args = [].slice.call(arguments);
    events.emit.apply(events, arguments);
  },

  // create selective mixInto method for these
  on = function on() {
    var args = [].slice.call(arguments);
    events.on.apply(events, arguments);    
  },

  app = {},
  api,

  init = function init(options) {
    if (options.environment) {
      app.environment = options.environment;
    }
  },

  register = function register(ns, api) {
    if (!app[ns]) {
      app[ns] = api;
    }
  };

api = extend(app, {
  init: init,
  deferred: deferred,
  register: register,
  events: events,
  trigger: trigger,
  on: on
});


// Emit render_ready event when renderReady resolves.
renderReady.done(function () {
  app.trigger('render_ready');
});


$(document).ready(function () {
  // TODO: change this to pageReady when beforeRender
  // support is added.
  renderReady.resolve();
});

module.exports = api;
