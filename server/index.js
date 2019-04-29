const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

// MongoDBモデル
require('./models/User');
require('./models/Survey');

require('./services/passport');

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
});

const app = express();

// いつものせってい
app.use(bodyParser.json());

// クッキー設定
app.use(
  cookieSession({
    // 有効期限30日
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 認証ルート
require('./routes/authRoutes')(app);
// stripeルート
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// 本番環境はフロントエンド用ルートを実装
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`start express server : localhost:${PORT}`);