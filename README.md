# Tinyapp - Simple module management.

Tinyapp is a simple event-driven client-side JavaScript application architecture and module management framework that serves the following needs:

* Namespacing
* Sandbox
* Environment
* Lifecycle Hooks
* Deferreds / Promises

# **View the slideshow: ["Introducing Applitude: Simple Module Management"](https://docs.google.com/presentation/embed?id=1BQ6s5EzLqenWZX1RCUIgVlJViKzjZAvvxN4UVkQzspo&start=false&loop=false&delayms=10000)**

**Status** - Developer preview (stick to tested, documented features for best results). [![Build Status](https://secure.travis-ci.org/dilvie/tinyapp.png)](http://travis-ci.org/dilvie/tinyapp)

The guiding philosophy of Tinyapp is “Less is more.” Tinyapp lays the wiring and then gets out of the way of your modules. Hence the subtitle, “Simple Module Management.”

Tinyapp was created to illustrate how to implement a client-side JavaScript application architecture for the upcoming book "Programming JavaScript Applications" (O'Reilly).

## Who's Using Tinyapp?

* [Tout](http://tout.com/)


## Getting started

Tinyapp uses `npm` for dependency management and CommonJS to use the dependencies in your modules.

If you don't have node installed, you can download it from `http://nodejs.org/download/`.

In your project's `package.json` file, make sure to include tinyapp:

    dependencies: {
      "tinyapp": "*" // use latest version
    }

You'll also need something like browserify and grunt to build your app:

  "devDependencies": {
    "grunt-browserify": "~0.1.x",
    "grunt": "~0.3.x",
    "traverse": "~0.6.x",
    "browserify": "~1.15.x"
  }


### Inside your main file (often, `app.js`):

    var app = require('tinyapp');

    app.init({
      // Pass your app configuration in here.
      environment: myEnvironment,

      // A promise that must be resolved before the app
      // renders.
      beforeRender: myPromise
    });


### Create your first tinyapp module

    var app = require('tinyapp');

    // use app as desired


And a namespace:

    var app = require('tinyapp'),
      namespace = 'hello';


Provide an API:

    var namespace = 'hello',
      app = require('tinyapp'),

      hello: function hello() {
        return 'hello, world';
      },

      api = {
        hello: hello
      };


Register your module:

    var namespace = 'hello',
      app = require('tinyapp'),

      hello: function hello() {
        return 'hello, world';
      },

      api = {
        hello: hello
      };

    app.register(namespace, api);


Export your api:

    var namespace = 'hello',
      app = require('tinyapp'),
      hello: function hello() {
        return 'hello, world';
      },

      api = {
        hello: hello
      };

    app.register(namespace, api);
    module.exports = api;

Exporting your module makes it available to `require()` in other modules. This will be necessary if you're writing code that must be shared between modules (such as common utilities), or if there is a clear parent module / submodule relationship. In general, modules should know as little as possible about each other in order to minimize coupling.


You might be tempted to create shortcuts like:

    var app = require('tinyapp');

    app.register('hello', {
      hello: function () {
        return 'hello, world';
      });


However, once you get into the Tinyapp groove, you'll be using a lot of events, and declaring a namespace lets you do things like this:

    app.trigger('some_action.' + namespace, eventData);

Then, if you need to move responsibilities from one module to another, or change the name of your module, you don't have to change any of this code.

Also, declaring your API explicitly makes it immediately clear which parts of your module constitute the exposed interface:

      api = {
        hello: hello
      };

In this case, it's just `hello`, but most interfaces will be more complicated. This is also a great clue about what you need to write tests for. If it's not in the API, don't write tests for it. You should be testing that your interface conforms to the contract.

When you declare your API, you're making an implied guarantee that users can safely use the attributes exposed on that API, so you need to write unit tests to be sure that's the case.


### Loading and Rendering

Module initialization is broken into two phases:

#### Load

The first is the load phase. Tinyapp exposes an `app.loadReady()` method that takes a callback function that you define in your module. The intention of the `app.loadReady()` method is to allow you to begin setting up your data models, including firing any asynchronous Ajax load methods that need to happen before you can render your module to the document.


#### Render

Similarly, the `app.renderReady()` callback is called after:

1. all `.beforeRender` callbacks have fired, and
1. the DOM is ready to be manipulated

This allows you to defer render until it's safe to do so. For example, say you want to render Skrillex tour dates from BandsInTown:

    var namespace = 'skrillexInfo',
      app = require('tinyapp'),
      data,
      whenLoaded,
  
      load = function load(url) {
        var url = url || 
          'http://api.bandsintown.com/artists/Skrillex.' +
          'json?api_version=2.0&app_id=YOUR_APP_ID';

        whenLoaded = app.get(url);

        whenLoaded.done(function (response) {
          data = response;
        });

        return whenLoaded.promise();
      },

      render = function render(data) {

      }

      // Expose API for flexibility and unit testing.
      api = {
        load: load,
        render: render
      };

    // Register load and render callbacks.
    app.loadReady(load);
    app.renderReady(render);

    app.register(namespace, api);


Tip: Try not to do anything blocking in your `app.loadReady()` callback. For example, you might want to asynchronously fetch the data that you need to complete your page render, but if you're loading a fairly large collection and you need to iterate over the collection and do some data processing, save the data processing step for `app.renderReady()`, when you're not blocking the page load process.

*You can't safely manipulate the DOM at all in your `.loadReady()` callback.*


## Environment

Environment is made up of things like image hosting URLs which might vary from one host or CDN to another. Generally server side environments will also contain passwords, secrets, or tokens for communicating with third party APIs. Since the client-side environment is not secure, you should not pass those secrets through to the client layer.

Environment variables should be passed into your application from your environment configuration, and not hard-coded. Your application should be portable to new hardware or hosts without any changes to your codebase.

It might be tempting to pass a single environment string through and put logic in your code to determine URLs and so on, but that should be done at the configuration level wherever possible. That will make it easier to port your app to new environments.

As a general rule of thumb, your app should be ready to open-source at any time, even if you never intend to do it. That mode of thought will help establish the proper separation of environment configuration and secrets from application code.

For more on application configuration, see ["The Twelve-Factor App"](http://www.12factor.net/config)


## Options

### `.beforeRender`

`beforeRender` is a list of application-level promises which all must finish before the render process begins. For example, many apps will need i18n translations to load before modules are allowed to render. By adding an i18n promise to the application's `beforeRender` queue, you can postpone render until the translations are loaded. Using `beforeRender` can prevent tricky race condition bugs from cropping up, and provide a neat solution if you need a guaranteed way to handle tasks before the modules render.

You can resolve `beforeRender` promises by listening for an expected event to fire. Inside `app.js`:

    var namespace = 'i18n',
      whenI18nLoaded = app.deferred();

    app.on('translations_loaded.' + namespace, function () {
      whenI18nLoaded.resolve();
    });

    app('hello', {
      beforeRender: [whenI18nLoaded.promise()],
    });


Later:

    whenTranslationsLoaded.done(function () {
      app.trigger('translations_loaded.' + namespace);
    });


## Tinyapp Responsibilities

### Events

Modules should know as little as possible about each other. To that end, modules should communicate through an app level event bus, supplied by the tinyapp sandbox. You can use `app.on()` to subscribe to events, `app.off` to unsubscribe, and `app.trigger()` to publish.

    app.on('a.*', function (data) { 
        console.log(data);
    });
    
    // later
    app.trigger('a.b', 'hello, world'); // logs 'hello, world'

Best practice is to get specific about the events you report, and always use your module's namespace to trigger. For example:

    var namespace = 'videoPlayer',

      bindEvents = function bindEvents() {
        app.$('#' + namespace).on('click', '#playButton', function (event) {
          app.trigger('click.' + namespace, event);
        });
      },

      api = {
          render: bindEvents
      };

    app.renderReady(bindEvents);
    app.register(namespace, api);


Events support wildcards. This way, you can implement cross-cutting concerns. For example, log every click in your app:

    var namespace = 'clickLogger',

      logData = function logData(event) {
        // Log to data 
      },

      api;

    app.on('click.*', logData);

    app.register(namespace, api);


## Sandbox

Access libraries and utilities through a canonical interface (a facade), rather than calling library code directly. Doing so allows you to modify the implementation, or swap out the library completely with transparency to the application code.


### Included Sandbox API

* `.init()` - Initialize the app.
* `.register()` - Register your module with the app.
* `.loadReady()` - Pass in callbacks to run at load time.
* `.renderReady()` - Pass in callbacks to run at render time.
* `.events` - Node Event Emitter compatible event emitter.
* `.on()` - Delegates to `events.on()`.
* `.off()` - Delegates to `events.off()`.
* `.trigger()` - Delegates to `events.emit()`.
* `.$()` - A selector engine for dom utilities.
* `.get()` - jQuery compatible Ajax `.get()`.
* `.ajax()` - jQuery compatible `.ajax()`.
* `.when` - jQuery compatible .when().
* `.deferred()` - jQuery compatible deferred API.
* `.resolved` - A resolved promise.
* `.rejected` - A rejected promise.


## Registration

Modules are registered in order to provide a mechanism to easily add cross cutting concerns to the application, as well as enforce an object hierarchy of registered modules. The same namespace cannot be occupied by two different modules.

Tinyapp supports deep namespaces. For example:

    var namespace = 'player.playerView';

    // Later...
    app.register(namespace, api);

This example will create an `app.player` object if it doesn't already exist, and attach the playerView at `app.player.playerView`.

## Deferred utilities

Tinyapp relies on promises and deferreds from the jQuery library. 
Tinyapp exposes a few Deferred utilities, including:

* `.resolved` - A resolved promise
* `.rejected` - A rejected promise
* `.when()` - A utility that allows you to run callbacks only after all promises passed to it are resolved.

These utilities can be helpful for coordinating asynchronous events in your application.

