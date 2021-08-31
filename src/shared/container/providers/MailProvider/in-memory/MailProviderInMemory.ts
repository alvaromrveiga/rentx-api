import { IMailProvider } from "../IMailProvider";

export class MailProviderInMemory implements IMailProvider {
  private messages = [];

  async sendMail(
    to: string,
    subject: string,
    variables: { name: string; link: string },
    path: string
  ): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}
