import { Injectable } from '@nestjs/common';
import { IEmailAdapter } from '../../base/interfaces/email.adapter.interface';
import { appSettings } from '../../settings/app.settings';
import { EmailMessage } from '../email/email.messages.manager';
import nodemailer from 'nodemailer';
import { ERRORS_CODES, InterlayerNotice } from '../../base/models/interlayer.notice';

@Injectable()
export class NodemailerAdapter implements IEmailAdapter {
  private sendFrom: string = appSettings.api.SEND_EMAIL_FROM;

  async sendEmail(mailTo: string, emailMessage: EmailMessage): Promise<InterlayerNotice<boolean>> {
    const interlayerNotice = new InterlayerNotice<boolean>();
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
      if (s.rejected.length > 0) {
        interlayerNotice.addError('Something wrong', 'server', ERRORS_CODES.EMAIL_SEND_ERROR);
        return interlayerNotice;
      } else {
        interlayerNotice.addData(true);
        return interlayerNotice;
      }
    } catch (err) {
      interlayerNotice.addError('Something wrong', 'server', ERRORS_CODES.EMAIL_SEND_ERROR);
      return interlayerNotice;
    }
  }
}
