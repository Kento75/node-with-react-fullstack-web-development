const keys = require('../config/keys');
// https://stripe.com/docs/api/charges/create -> create a charge
const stripe = require('stripe')(keys.stripeSecretKey);

module.exports = app => {
  // https://www.npmjs.com/package/stripe#using-promises
  // https://stripe.com/docs/api/charges/create -> create a charge
  app.post('/api/stripe', async (req, res) => {
    // ログインしていない場合
    // エラーを返す
    if (!req.user) {
      return res.status(401).send({
        error: 'You must log in!!'
      });
    }

    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });

    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
  });
};