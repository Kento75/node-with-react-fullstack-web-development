const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
// Google認証キー
const keys = require('../config/keys');

const User = mongoose.model('users');

// ユーザー情報のシリアライズ
passport.serializeUser((user, done) => {
  // ユーザーIDのみ返す(MongoDB内のID)
  done(null, user.id);
});

// ユーザー情報のデシリアライズ
// IDをデシリアライズして検索
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch();
});

passport.use(
  new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      // Proxy設定
      proxy: true
    },
    // コールバック
    // ユーザー情報登録
    async (accessToken, refreshToken, profile, done) => {
      // すでにユーザー情報が存在するか確認
      const existingUser = await User.findOne({
        googleId: profile.id
      });
      // すでに存在する
      if (existingUser) {
        return done(null, existingUser);
      }

      // ユーザーデータをDBにinsert
      const user = await new User({
        googleId: profile.id
      }).save();
      done(null, user);

    }
  )
);