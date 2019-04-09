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
    (accessToken, refreshToken, profile, done) => {
      new User({
        googleId: profile.id
      }).save();
    }
  )
);