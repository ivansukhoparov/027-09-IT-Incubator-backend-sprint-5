import { EmailMessage } from '../../common/email/email.messages.manager';
import { InterlayerNotice } from '../models/interlayer.notice';

export interface IEmailAdapter {
  sendEmail(mailTo: string, emailMessage: EmailMessage): Promise<InterlayerNotice<boolean>>;
}
