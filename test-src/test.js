var app = require('../src/tinyapp');

app.init({version: '0.0.1', environment: {test: 'test'}});

test('sanity', function () {
  ok(true, 'Assertions should run.');
});

test('app', function () {
  ok(app,'app should exist');
});

test('app.events on / trigger', function () {
  stop();
  app.on('a', function () {
    ok(true, 'app.trigger should cause app.on callback to fire');
    start();
  });
  app.trigger('a');
});


/*
test('render ready', function () {
  stop();
  var render = function render(timedout) {
    var msg = 'render_ready event should be fired on startup';
    if (timedout) {
      ok(false, msg);
    } else {
      ok(true, msg);
    }
    start();
  };
  app.on('render_ready', render);
  setTimeout(function () {
    render('timedout');
    start();
  }, 1000);
});
*/