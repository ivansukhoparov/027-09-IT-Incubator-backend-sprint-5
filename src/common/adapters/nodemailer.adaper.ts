import { Injectable } from '@nestjs/common';
import { IEmailAdapter } from '../../base/interfaces/email.adapter.interface';
import { appSettings } from '../../settings/app.settings';
import { EmailMessage } from '../email/email.messages.manager';
import nodemailer from 'nodemailer';

@Injectable()
export class NodemailerAdapter implements IEmailAdapter {
  private sendFrom: string = appSettings.api.SEND_EMAIL_FROM;

  async sendEmail(mailTo: string, emailMessage: EmailMessage) {
    try {
      const transporter = nodemailer.createTransport({
        service: appSettings.api.EMAIL_SERVICE,
        auth: {
          user: appSettings.api.EMAIL_LOGIN,
          pass: appSettings.api.EMAIL_PASSWORD,
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });

      const s = await transporter.sendMail({
        ...emailMessage,
        from: this.sendFrom,
        to: mailTo,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
