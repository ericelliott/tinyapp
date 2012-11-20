var app = require('../src/tinyapp');


app.$(document).ready(function () {

  app.init({version: '0.0.1', environment: {test: 'test'}});

  (function (app) {
    var whenAppInitFinished = app.deferred();

    app.on('app_initialized', function () {
      whenAppInitFinished.resolve();
    });

    app.init({
      info: {
        name: name,
        version: '0.0.1'
      },
      environment: {
        debug: true,
        test: 'test'
      },
      options: {
        beforeRender: [whenAppInitFinished.promise()],
        optionAdded: true
      }
    });

  }(app));

  test('Tinyapp core', function () {
    ok(app,
      'app should exist.');

    ok(app.environment && app.environment.debug,
      'Environment should load (triggered by app.js).');

    ok(app.options.optionAdded,
      'Options should get added to app object.');
  });

  test('Namespacing', function () {
    app.register('namespaceTest', true);
    equal(app.namespaceTest, true,
      '.register() should assign namespace.');

    app.register('namespaceTest', 'fail');
    equal(app.namespaceTest, true,
      '.register() should not allow duplicate registrations.');
  });


  test('Deferred utilities', function () {
    
    equal(app.resolved.state(), 'resolved',
      'app.resolved should be a resolved promise.');
    equal(app.rejected.state(), 'rejected',
      'app.rejected should be a rejected promise.');
    ok(app.when(app.resolved).state(), 'resolved',
      'app.when() should be available.');

  });

  test('app.events on / trigger', function () {
    stop();
    app.on('a', function () {
      ok(true, 'app.trigger should cause app.on callback to fire');
      start();
    });
    app.trigger('a');
  });

  test('render ready', function () {
    stop();
    var render = function render(timedout) {
      var msg = 'renderReady callback should fire' +
        ' when the app is ready to render.';
      if (timedout) {
        ok(false, msg);
      } else {
        ok(true, msg);
      }
      start();
    };
    app.renderReady(render);

    setTimeout(function () {
      render('timedout');
      start();
    }, 2000);

  });

});

