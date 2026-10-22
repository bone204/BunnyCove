import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { AppDefaults } from '../../common/constants/defaults.js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter(): void {
    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

    if (gmailUser && gmailPass) {
      if (process.env.GMAIL_USER || (!process.env.SMTP_HOST && gmailUser.includes('@gmail.com'))) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });
        this.logger.log(`📧 Gmail Transporter initialized for: ${gmailUser}`);
      } else if (process.env.SMTP_HOST) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });
        this.logger.log(`📧 SMTP Transporter initialized (${process.env.SMTP_HOST})`);
      }
    } else {
      this.logger.warn(
        '⚠️ No Gmail/SMTP credentials found in .env (GMAIL_USER & GMAIL_APP_PASSWORD). Running in Dev Console Fallback mode.',
      );
    }
  }

  private isMockOrTestEmail(to: string): boolean {
    const lower = to.trim().toLowerCase();
    return (
      lower.endsWith('.test') ||
      lower.endsWith('.example') ||
      lower.endsWith('@bunny.test') ||
      lower.endsWith('@example.com') ||
      lower.endsWith('@localhost') ||
      process.env.NODE_ENV === 'test'
    );
  }

  async sendVerificationEmail(to: string, displayName: string, otp: string): Promise<boolean> {
    const subject = AppDefaults.EMAIL.SUBJECT_VERIFY;
    const from = process.env.GMAIL_USER || AppDefaults.EMAIL.DEFAULT_FROM;
    const html = this.buildVerificationEmailHtml(displayName, otp);

    // Prevent live SMTP delivery to test/mock addresses to protect sender reputation
    if (this.isMockOrTestEmail(to)) {
      this.logger.log(
        `\n======================================================\n🐰 [TEST/DEV EMAIL INTERCEPTED] BUNNY COVE ACCOUNT VERIFICATION\nTo: ${to} (${displayName})\nVerification OTP (2 mins): [ ${otp} ]\n======================================================\n`,
      );
      return true;
    }

    if (!this.transporter) {
      this.logger.log(
        `\n======================================================\n🐰 [DEV EMAIL FALLBACK] BUNNY COVE ACCOUNT VERIFICATION\nTo: ${to} (${displayName})\nVerification OTP (2 mins): [ ${otp} ]\n======================================================\n`,
      );
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: `"Bunny Cove" <${from}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`✅ Verification email sent to ${to} [OTP: ${otp}]`);
      return true;
    } catch (error: any) {
      this.logger.error(`❌ Failed to send verification email to ${to}: ${error.message}`);
      // Rescue log so developers and automated test suites can proceed
      this.logger.warn(`🐰 [RESCUE LOG] OTP for ${to} is: [ ${otp} ]`);
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, displayName: string, otp: string): Promise<boolean> {
    const subject = AppDefaults.EMAIL.SUBJECT_RESET_PASSWORD;
    const from = process.env.GMAIL_USER || AppDefaults.EMAIL.DEFAULT_FROM;
    const html = this.buildResetPasswordEmailHtml(displayName, otp);

    // Prevent live SMTP delivery to test/mock addresses to protect sender reputation
    if (this.isMockOrTestEmail(to)) {
      this.logger.log(
        `\n======================================================\n🔐 [TEST/DEV EMAIL INTERCEPTED] BUNNY COVE PASSWORD RESET\nTo: ${to} (${displayName})\nPassword Reset OTP (2 mins): [ ${otp} ]\n======================================================\n`,
      );
      return true;
    }

    if (!this.transporter) {
      this.logger.log(
        `\n======================================================\n🔐 [DEV EMAIL FALLBACK] BUNNY COVE PASSWORD RESET\nTo: ${to} (${displayName})\nPassword Reset OTP (2 mins): [ ${otp} ]\n======================================================\n`,
      );
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: `"Bunny Cove" <${from}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`✅ Password reset email sent to ${to} [Reset OTP: ${otp}]`);
      return true;
    } catch (error: any) {
      this.logger.error(`❌ Failed to send reset password email to ${to}: ${error.message}`);
      // Rescue log so developers and automated test suites can proceed
      this.logger.warn(`🔐 [RESCUE LOG] Reset OTP for ${to} is: [ ${otp} ]`);
      return false;
    }
  }

  private buildVerificationEmailHtml(displayName: string, otp: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác thực tài khoản Bunny Cove</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFF5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFF5F7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 500px; background-color: #FFFFFF; border-radius: 24px; box-shadow: 0 10px 30px rgba(255, 138, 174, 0.15); overflow: hidden; border: 2px solid #FFE4EC;">
          <!-- Header -->
          <tr>
            <td style="padding: 35px 30px 20px; text-align: center; background: linear-gradient(135deg, #FFF0F4 0%, #FFE4EC 100%);">
              <div style="font-size: 48px; line-height: 1;">🐰</div>
              <h1 style="margin: 12px 0 0; color: #E75480; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Bunny Cove</h1>
              <p style="margin: 6px 0 0; color: #8F5E6E; font-size: 14px; font-weight: 500;">Vũ Trụ Mini-Game & Không Gian Kết Nối Ấm Cúng</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 35px;">
              <h2 style="margin: 0 0 12px; color: #332026; font-size: 18px; font-weight: 700;">Chào bạn ${displayName} ơi! 🌸</h2>
              <p style="margin: 0 0 25px; color: #6E535C; font-size: 14px; line-height: 1.6;">
                Cảm ơn bạn đã gia nhập thị trấn thỏ Bunny Cove. Để bắt đầu tham gia các phòng game, khám phá kho mini-game phong phú và kết nối cùng bạn bè, vui lòng nhập mã OTP xác thực dưới đây vào ứng dụng:
              </p>
              <!-- OTP Box -->
              <div style="background-color: #FFF0F5; border: 2px dashed #FF94B4; border-radius: 16px; padding: 22px; text-align: center; margin: 0 0 25px;">
                <span style="font-size: 12px; font-weight: 700; color: #D84374; text-transform: uppercase; letter-spacing: 1px;">Mã Xác Thực Của Bạn</span>
                <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #D81B60; margin: 10px 0; font-family: 'Courier New', Courier, monospace;">${otp}</div>
                <span style="font-size: 13px; color: #8C5568; font-weight: 600;">⏰ Mã chỉ có hiệu lực trong vòng <strong>2 phút</strong></span>
              </div>
              <p style="margin: 0; color: #A48992; font-size: 12px; line-height: 1.5; text-align: center;">
                Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email này nhé.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #FAFAFA; border-top: 1px solid #F0F0F0;">
              <p style="margin: 0; color: #BDBDBD; font-size: 12px;">© 2026 Bunny Cove Universe. Mọi quyền được bảo lưu.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  private buildResetPasswordEmailHtml(displayName: string, otp: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yêu cầu đặt lại mật khẩu Bunny Cove</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFF5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFF5F7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 500px; background-color: #FFFFFF; border-radius: 24px; box-shadow: 0 10px 30px rgba(255, 138, 174, 0.15); overflow: hidden; border: 2px solid #FFE4EC;">
          <!-- Header -->
          <tr>
            <td style="padding: 35px 30px 20px; text-align: center; background: linear-gradient(135deg, #FFF0F4 0%, #FFE4EC 100%);">
              <div style="font-size: 48px; line-height: 1;">🔐</div>
              <h1 style="margin: 12px 0 0; color: #E75480; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Bunny Cove</h1>
              <p style="margin: 6px 0 0; color: #8F5E6E; font-size: 14px; font-weight: 500;">Bảo Mật Tài Khoản Cư Dân Bunny Cove</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 35px;">
              <h2 style="margin: 0 0 12px; color: #332026; font-size: 18px; font-weight: 700;">Xin chào ${displayName}!</h2>
              <p style="margin: 0 0 25px; color: #6E535C; font-size: 14px; line-height: 1.6;">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Bunny Cove của bạn. Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc thiết lập mật khẩu mới:
              </p>
              <!-- OTP Box -->
              <div style="background-color: #FFF0F5; border: 2px dashed #FF94B4; border-radius: 16px; padding: 22px; text-align: center; margin: 0 0 25px;">
                <span style="font-size: 12px; font-weight: 700; color: #D84374; text-transform: uppercase; letter-spacing: 1px;">Mã OTP Đặt Lại Mật Khẩu</span>
                <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #D81B60; margin: 10px 0; font-family: 'Courier New', Courier, monospace;">${otp}</div>
                <span style="font-size: 13px; color: #8C5568; font-weight: 600;">⏰ Mã chỉ có hiệu lực trong vòng <strong>2 phút</strong></span>
              </div>
              <p style="margin: 0 0 10px; color: #C2185B; font-size: 13px; font-weight: 600; line-height: 1.5;">
                ⚠️ Cảnh báo an toàn: Tuyệt đối không cung cấp mã này cho bất kỳ ai, kể cả quản trị viên!
              </p>
              <p style="margin: 0; color: #A48992; font-size: 12px; line-height: 1.5; text-align: center;">
                Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua và kiểm tra lại an toàn cho tài khoản của bạn.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #FAFAFA; border-top: 1px solid #F0F0F0;">
              <p style="margin: 0; color: #BDBDBD; font-size: 12px;">© 2026 Bunny Cove Universe. Mọi quyền được bảo lưu.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
