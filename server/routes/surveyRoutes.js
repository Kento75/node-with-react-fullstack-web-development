const _ = require('lodash');
const Path = require('path-parser');
const {
  URL
} = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  // 一覧取得
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({
      _user: req.user.id
    }).select({
      recipients: false
    });
    res.send(surveys);
  });

  // Thanksルート
  // ※メールクリック時
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  });

  // Yesクリック時
  app.get('/api/surveys/:id/yes', (req, res) => {
    res.send('This is Yes branch');
  });

  // Noクリック時
  app.get('/api/surveys/:id/no', (req, res) => {
    res.send('This is No branch');
  });

  // Sendgridのwebhook受付時
  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    const events = _.chain(req.body)
      .map(({
        email,
        url
      }) => {
        const match = p.test(new URL(url).pathname);
        // パスが等しいことを確認
        if (match) {
          // メールアドレス、投票ID、Yes or No の判定を取得
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice,
          };
        }
      })
      .compact() // 連続クリック対策 一意な情報のみ取得するd
      .uniqBy('email', 'surveyId')
      .each(({
        surveyId,
        email,
        choice
      }) => {
        Survey.updateOne({
          _id: surveyId,
          recipients: {
            $elemMatch: {
              email: email,
              responded: false
            }
          }
        }, {
          $inc: {
            [choice]: 1
          },
          $set: {
            'recipients.$.responded': true
          }
        }).exec();
      })
      .value();

    res.send({});
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

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};