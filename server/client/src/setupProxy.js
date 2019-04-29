const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy('/auth/google', {
    target: 'http://localhost:5000'
  }));
  app.use(proxy('/api/current_user', {
    target: 'http://localhost:5000'
  }));
  app.use(proxy('/api/stripe', {
    target: 'http://localhost:5000'
  }));
  app.use(proxy('/api/surveys', {
    target: 'http://localhost:5000'
  }));
  app.use(proxy('/api/surveys/thanks', {
    target: 'http://localhost:5000'
  }));
};