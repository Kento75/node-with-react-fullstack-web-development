const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({subject, recipients}, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    // システムメールアドレス設定
    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    // メール本文設定
    this.body = new helper.Content('text/html', content);
    // 送信先メールアドレス設定
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  // 送信先メールアドレス取得
  formatAddresses(recipients) {
    return recipients.map(({email}) => {
      return new helper.Email(email);
    });
  }

  // clickイベントトラッキングの有効化
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  // 送信先追加
  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // メール送信
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON(),
    });

    const response = this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
