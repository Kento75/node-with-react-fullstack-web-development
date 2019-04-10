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
    },
    // コールバック
    // ユーザー情報登録
    (accessToken, refreshToken, profile, done) => {
      // すでにユーザー情報が存在するか確認
      User.findOne({
          googleId: profile.id
        })
        .then(existingUser => {
          if (existingUser) {
            // すでに存在する
            done(null, existingUser);
          } else {
            new User({
                googleId: profile.id
              })
              .save()
              .then(user => done(null, user));
          }
          // 例外握りつぶしはよくない
        }).catch();
    }
  )
);