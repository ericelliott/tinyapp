# Tinyapp - Minimal module management

Tinyapp provides application module namespacing and event-based communication to help decouple and coordinate small modules, as opposed to building up a large, tightly coupled, monolithic app.

Tinyapp assumes CommonJS modules, AKA Node style `require()`. 

Need help using CommonJS in the browser? Check out [Browserify](https://github.com/substack/node-browserify).

Tinyapp exposes .loadReady() and .renderReady() methods so you can use .load() and .render() for whatever you want. Inside your module:

    var app = require('tinyapp');

    var api = new Backbone.View.extend({
      render: function render() {
        // do stuff to dom
      } 
    });

    function myLoad() {
      // get some data asynchronously from server
    }

    function myRender() {
      // draw stuff to screen
    }

    app.loadReady(myLoad);
    app.renderReady(myRender);
    app.register(namespace, api);
