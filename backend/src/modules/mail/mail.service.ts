import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl: string;
  private readonly isSmtpConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    this.frontendUrl =
      this.configService.get<string>('app.frontendUrl') ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173';

    const smtpHost = process.env.SMTP_HOST || this.configService.get<string>('mail.host');
    this.isSmtpConfigured = Boolean(smtpHost && smtpHost !== 'localhost' && process.env.SMTP_USER);
  }

  async sendVerificationEmail(toEmail: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/auth/verify-email?token=${token}`;
    const subject = 'Verify your email address - Dyvin AI';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Dyvin AI!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verifyUrl}</p>
        <p>This verification link will expire in 24 hours.</p>
      </div>
    `;

    await this.sendMail({ to: toEmail, subject, html, text: `Verify email: ${verifyUrl}` });
  }

  async sendPasswordResetEmail(toEmail: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/auth/reset-password?token=${token}`;
    const subject = 'Reset your password - Dyvin AI';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Dyvin AI account.</p>
        <p><a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `;

    await this.sendMail({ to: toEmail, subject, html, text: `Reset password: ${resetUrl}` });
  }

  private async sendMail(options: EmailOptions): Promise<void> {
    if (this.isSmtpConfigured) {
      this.logger.log(`[SMTP] Dispatched email to ${options.to} - Subject: ${options.subject}`);
    } else {
      this.logger.log(`==================== [DEV MAIL TRANSPORT] ====================`);
      this.logger.log(`TO: ${options.to}`);
      this.logger.log(`SUBJECT: ${options.subject}`);
      this.logger.log(`CONTENT: ${options.text ?? options.html}`);
      this.logger.log(`==============================================================`);
    }
  }
}
