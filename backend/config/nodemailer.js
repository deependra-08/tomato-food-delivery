import nodemailer from 'nodemailer';

export const createTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // If Gmail account is configured
    if (process.env.SMTP_USER.includes('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // Gmail App Password
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal Test Transporter
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendOtpEmail = async (toEmail, otpCode, type = 'signup') => {
  const isConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  try {
    const transporter = await createTransporter();

    const subject = type === 'signup' 
      ? 'Tomato Food Delivery - Verify Your Email OTP' 
      : 'Tomato Food Delivery - Password Reset OTP';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 520px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #e23744; text-align: center; font-size: 24px; margin-bottom: 5px;">Tomato Food Delivery</h2>
        <p style="text-align: center; color: #64748b; font-size: 13px; margin-top: 0;">Email Verification System</p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;">
        <p style="font-size: 16px; color: #0f172a; font-weight: 600;">Hello,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6;">
          ${type === 'signup' 
            ? 'Thank you for signing up with Tomato! Please enter the 6-digit OTP verification code below to verify your email and activate your account:' 
            : 'We received a request to reset your password. Please enter the 6-digit OTP code below to reset your password:'}
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ffffff; background: linear-gradient(135deg, #e23744 0%, #ff525d 100%); padding: 14px 36px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(226, 55, 68, 0.3);">
            ${otpCode}
          </span>
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 25px;">
          This OTP code is valid for 10 minutes. If you did not initiate this request, please disregard this email.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Tomato Food Delivery" <${process.env.SMTP_USER || 'noreply@tomatofood.com'}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log(`\n==================================================`);
    console.log(`[OTP SENT] To: ${toEmail} | Code: ${otpCode} | Real SMTP: ${isConfigured ? 'YES' : 'NO'}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Ethereal Web Preview]: ${nodemailer.getTestMessageUrl(info)}`);
    }
    console.log(`==================================================\n`);

    return { 
      success: true, 
      isRealEmailSent: isConfigured, 
      messageId: info.messageId, 
      previewUrl: nodemailer.getTestMessageUrl(info) 
    };

  } catch (error) {
    console.error("Error sending OTP email:", error);
    console.log(`\n[LOCAL OTP FALLBACK] To: ${toEmail} | Code: ${otpCode}\n`);
    return { success: true, isRealEmailSent: false, fallback: true };
  }
};
