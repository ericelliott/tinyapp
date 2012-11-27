var app = require('../src/tinyapp');


app.$(document).ready(function () {

  app.init({environment: {test: 'test'}});

  test('Tinyapp core', function () {
    ok(app,
      'app should exist.');

    equal(app.environment && app.environment.test,
      'test',
      'Environment should load (triggered by app.js).');
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

  asyncTest('app.on sourceId support', function () {
    var sourceId = app.cuid();
    app.on('added', sourceId, function (event) {
      ok(true,
        'sourceId support abstracts away relevance checks.');
      start();
    });

    app.trigger('added', {
      sourceId: sourceId,
      detail: 'test'
    });
  });

  test('app.events off', function () {
    var counter = 0,
      cb = function cb() {
        counter++;
      };
    stop();

    // Attach event listener
    app.on('b', cb);

    // Fire test event
    app.trigger('b');

    // Detach event listener
    app.off('b', cb);

    // Fire another test event
    app.trigger('b');

    equal(counter, 1,
      'Events should not trigger callbacks after the ' +
      'listener has been detached with .off().');

    start();
  });

  test('app.events off() with namespaces', function () {
    var counter = 0,
      cb = function cb() {
        counter++;
      },
      cb2 = function cb() {
        counter += 2;
      },
      cb3 = function cb() {
        counter += 5;
      };
    stop();

    // Attach event listeners
    app.on('b.ns1', cb);
    app.on('b.ns1', cb2);
    app.on('b.ns2', cb3);

    // Fire test event
    app.trigger('b.ns1');

    // Detach event listener
    app.off('b.ns1');

    // Make sure ns1 handlers are gone, ns2 handler remains.
    app.trigger('b.ns1');
    app.trigger('b.ns2');

    equal(counter, 8,
      'Passing a single param into .off() should support ' +
      'removing by namespace.');

    start();
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

