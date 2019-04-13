if (process.env.NODE_ENV === 'production') {
  // 本番環境の場合
  module.exports = require('./prod');
} else {
  // 開発・検証環境の場合
  module.exports = require('./dev');
}