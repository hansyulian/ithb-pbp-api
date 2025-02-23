import { appConfig } from "~/config";
import nodemailer from "nodemailer";
import { isValidEmail } from "~/utils/isValidEmail";

export type SimpleMailInfo = {
  to: string;
  subject: string;
  content: string;
};

export class Mailer {
  transporter = nodemailer.createTransport(
    {
      host: appConfig.nodemailer.host,
      port: appConfig.nodemailer.port,
      auth: {
        user: appConfig.nodemailer.username,
        pass: appConfig.nodemailer.password,
      },
    } as any,
    {
      from: appConfig.nodemailer.from,
    }
  );

  constructor() {}

  async send(to: string, subject: string, html: string) {
    if (!isValidEmail(to)) {
      return false;
    }
    const result = await this.transporter.sendMail({
      to,
      subject,
      html,
    });
    return result;
  }
}
