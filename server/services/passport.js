const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
// Google認証キー
const keys = require('../config/keys');

const User = mongoose.model('users');

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
          } else {
            new User({
              googleId: profile.id
            }).save();
          }
        })
    }
  )
);