/**
 * Base layout for all Kraya emails.
 * Keeps the header (logo), footer (links), and legal text perfectly consistent across all emails.
 */
export const baseEmailLayout = (content: string) => `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; color: #333333; background-color: #ffffff;">
        
        <!-- Brand / Logo Area -->
        <div style="margin-bottom: 40px;">
            <h1 style="color: #f28522; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px;">Kraya<span style="font-size: 14px; vertical-align: super;">®</span></h1>
        </div>

        <!-- DYNAMIC CONTENT -->
        ${content}

        <!-- Footer Help Text -->
        <p style="font-size: 13px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 40px;">
            If you have any questions, please visit our <a href="#" style="color: #f28522; text-decoration: none; font-weight: 700;">FAQs</a> or email us at <a href="mailto:help@kraya.com" style="color: #f28522; text-decoration: none; font-weight: 700;">help@kraya.com</a>. Our team can answer questions about your account or help you with your shopping experience.
        </p>

        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #eaeaeb; margin: 30px 60px;">

        <!-- Legal / Footer Links -->
        <div style="margin-bottom: 20px; font-size: 12px; color: #555555; font-weight: 500;">
            <a href="#" style="color: #555555; text-decoration: none; margin: 0 10px;">My Kraya</a> | 
            <a href="#" style="color: #555555; text-decoration: none; margin: 0 10px;">How it works</a> | 
            <a href="#" style="color: #555555; text-decoration: none; margin: 0 10px;">T&Cs</a> | 
            <a href="#" style="color: #555555; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        </div>

        <!-- Small Print -->
        <p style="font-size: 11px; line-height: 1.6; color: #999999; padding: 0 40px; margin-bottom: 0;">
            You have received this email as a registered user of Kraya®<br>
            Kraya, Inc., 123 Commerce Avenue, E-commerce City, 90210.<br>
            © ${new Date().getFullYear()} Kraya Inc.<br>
            All rights reserved.
        </p>
    </div>
`;
