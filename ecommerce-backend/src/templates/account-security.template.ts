import { baseEmailLayout } from "./base.template";

/**
 * 1. Welcome / Email Verification
 */
export const getVerificationEmailTemplate = (customerName: string, verificationLink: string, expiryTime: string = "2 hours") => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Verify your<br>email address
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 40px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, you're so close to starting your Kraya journey. To finish signing up, just click the button below to confirm your email address for us. The link will be valid for the next ${expiryTime}.
        </p>
        <div style="margin-bottom: 60px;">
            <a href="${verificationLink}" style="display: inline-block; padding: 16px 40px; background-color: #f28522; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px;">Verify my email</a>
        </div>
    `);
};

/**
 * 2. Password Reset / Forgot Password
 */
export const getPasswordResetTemplate = (customerName: string, resetPasswordUrl: string, expiryTime: string = "15 minutes") => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Reset your<br>password
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 40px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, we received a request to reset the password for your Kraya account. If you made this request, please click the button below. This link will expire in ${expiryTime}.
        </p>
        <div style="margin-bottom: 60px;">
            <a href="${resetPasswordUrl}" style="display: inline-block; padding: 16px 40px; background-color: #f28522; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-bottom: 40px; padding: 0 20px;">
            If you didn't request a password reset, you can safely ignore this email.
        </p>
    `);
};

/**
 * 3. Password Changed Confirmation
 */
export const getPasswordChangedTemplate = (customerName: string, timestamp: string, deviceIpAddress: string, supportUrl: string) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Password<br>Updated
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 40px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, the password for your Kraya account was recently changed.
        </p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;"><strong>Time:</strong> ${timestamp}</p>
            <p style="margin: 0; font-size: 14px; color: #555555;"><strong>IP Address:</strong> ${deviceIpAddress}</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-bottom: 40px; padding: 0 20px;">
            If this was you, no further action is needed. If you did not make this change, please secure your account immediately by contacting our <a href="${supportUrl}" style="color: #f28522; text-decoration: none; font-weight: 700;">support team</a>.
        </p>
    `);
};

/**
 * 4. Login OTP / Multi-Factor Authentication
 */
export const getLoginOtpTemplate = (otpCode: string, expiryTime: string = "10 minutes") => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Your Login<br>Code
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 40px; padding: 0 20px; font-weight: 500;">
            Please use the following verification code to securely log in to your Kraya account. This code is valid for the next ${expiryTime}.
        </p>
        <div style="margin-bottom: 60px;">
            <div style="display: inline-block; padding: 20px 40px; background-color: #f9f9f9; border: 2px dashed #f28522; color: #333333; border-radius: 10px; font-weight: 800; font-size: 32px; letter-spacing: 4px;">
                ${otpCode}
            </div>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-bottom: 40px; padding: 0 20px;">
            Do not share this code with anyone. Our team will never ask you for your password or OTP.
        </p>
    `);
};
