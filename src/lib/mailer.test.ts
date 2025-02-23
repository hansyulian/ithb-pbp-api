import nodemailer from "nodemailer";
import { Mailer } from "~/lib/mailer";

jest.mock("nodemailer"); // Mock the nodemailer module

const { createTransport } = nodemailer;

describe("lib: Mailer", () => {
  let mailer: Mailer;
  const sendMailMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock nodemailer.createTransport to return a fake transporter
    (createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    // Create an instance of the Mailer class
    mailer = new Mailer();
  });

  it("should configure the transporter correctly", () => {
    expect(createTransport).toHaveBeenCalledWith(
      {
        host: "mock.nodemailer.host",
        port: 587,
        auth: {
          user: "mockmail@email.com",
          pass: "mockmail-password",
        },
      },
      { from: "mock from" }
    );
  });

  it("should send an email successfully", async () => {
    const mockResult = {
      accepted: ["recipient@example.com"],
      messageId: "123",
    };
    sendMailMock.mockResolvedValue(mockResult);

    const to = "recipient@example.com";
    const subject = "Test Email";
    const html = "<h1>Welcome!</h1>";

    const result = await mailer.send(to, subject, html);

    expect(sendMailMock).toHaveBeenCalledWith({ to, subject, html });
    expect(result).toEqual(mockResult);
  });

  it("should throw an error when email sending fails", async () => {
    const error = new Error("Email sending failed");
    sendMailMock.mockRejectedValue(error);

    const to = "fail@example.com";
    const subject = "Fail Test";
    const html = "<h1>Oops!</h1>";

    await expect(mailer.send(to, subject, html)).rejects.toThrow(
      "Email sending failed"
    );

    expect(sendMailMock).toHaveBeenCalledWith({ to, subject, html });
  });

  it("should ignore if the email is invalid", async () => {
    const to = "inv a lid mail example.com";
    const subject = "Fail Test";
    const html = "<h1>Oops!</h1>";

    expect(await mailer.send(to, subject, html)).toStrictEqual(false);
  });
});
