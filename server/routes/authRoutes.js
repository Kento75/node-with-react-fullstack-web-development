const passport = require('passport');

module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));

  // ログアウト
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  // ユーザー情報
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};