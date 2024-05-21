import { EmailMessage } from '../../common/email/email.messages.manager';

export interface IEmailAdapter {
  sendEmail(mailTo: string, emailMessage: EmailMessage): Promise<boolean>;
}
