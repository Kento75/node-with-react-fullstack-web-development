const keys = require('../config/keys');
// https://stripe.com/docs/api/charges/create -> create a charge
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  // https://www.npmjs.com/package/stripe#using-promises
  // https://stripe.com/docs/api/charges/create -> create a charge
  app.post('/api/stripe', requireLogin, async (req, res) => {

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