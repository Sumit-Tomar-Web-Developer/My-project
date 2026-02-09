// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_ID,
//     pass: process.env.PASSWORD,
//   },
// });

// const SENDMAIL = async (mailDetails, callback) => {
//   try {
//     if (process.env.EMAIL_REQUIRED === 'true') {
//       const info = await transporter.sendMail(mailDetails);
//       callback(info);
//     } else {
//       console.log('Email sending is not required.');
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default SENDMAIL;
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: process.env.port||587,
  secure: false, // Set to false for TLS, true for SSL (465 port)
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const SENDMAIL = async (mailDetails) => {
  console.log(mailDetails,"mail details");
  try {
    if (process.env.EMAIL_REQUIRED === 'true') {
      const info = await transporter.sendMail(mailDetails);
      console.log('Email sent:', info.response);
      return info; // No callback needed
    } else {
      console.log('Email sending is not required.');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed.');
  }
};



export const sendResetLink = async (userEmail) => {
  try {
    // find user by email
    const user = await AdminUser.findOne({ where: { email: userEmail } });

    // Always return success message (security best practice)
    if (!user) {
      return { message: 'If this email exists, a reset link has been sent' };
    }

    // generate token & expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // send email
    await SENDMAIL({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    });

    return { message: 'Password reset link sent to email' };
  } catch (error) {
    console.error('sendResetLink error:', error);
    throw new Error('Something went wrong while sending reset link');
  }
};

