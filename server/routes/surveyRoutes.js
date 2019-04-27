const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const {
      title,
      subject,
      body,
      recipients
    } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({
        email: email.trim(),
      })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Send an Email
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      // メール送信
      await mailer.send();
      // 投票情報の更新
      await survey.save();
      // クレジットを１消費
      req.user.credits -= 1;
      // ユーザー情報の更新
      const user = await req.user.save();

      res.send(user);
    } catch (e) {
      res.status(422).send(err);
    }
  });
};