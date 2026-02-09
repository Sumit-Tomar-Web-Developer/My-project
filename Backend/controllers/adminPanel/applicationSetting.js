// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import Users from '../../models/models/users.js';

// dotenv.config();

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_ID,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// // Generate random 5-digit OTP
// const generateOTP = () => {
//   return Math.floor(10000 + Math.random() * 90000).toString();
// };

// // Send OTP API
// export const sendOtp = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email or password missing' });
//     }

//     // 🔹 Verify user credentials from DB
//     const user = await Users.findOne({ where: { email, password } });

//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }

//     const otp = generateOTP();

//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_ID,
//       to: email,
//       subject: 'Your OTP for Core Project',
//       text: `Hello ${user.name},\n\nYour OTP is: ${otp}\nDo not share it with anyone.`
//     });

//     console.log('OTP sent:', info.response);

//     res.json({ success: true, message: 'OTP sent successfully', otp }); // otp for testing only
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// // POST /auth/verify-otp
// const otpStore = new Map(); // key: otp, value: userId

// // Send OTP
// const otp = generateOTP();
// otpStore.set(otp, Users.UserID);
// // POST /verify-otp
// export const verifyOtp = async (req, res) => {
//     try {
//       const { email, otp } = req.body;
  
//       if (!email || !otp) {
//         return res.status(400).json({ success: false, message: 'Email or OTP missing' });
//       }
  
//       const storedOtp = otpStore.get(email);
//       if (!storedOtp || storedOtp !== otp) {
//         return res.status(401).json({ success: false, message: 'Invalid OTP' });
//       }
  
//       otpStore.delete(email); // OTP used, remove it
  
//       res.json({ success: true, message: 'OTP verified successfully' });
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Users from '../../models/models/users.js';
import ApplicationSetting from '../../models/models/applicationSetting.js';
import { Op } from 'sequelize';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD
  }
});

const otpStore = new Map(); // key: email, value: otp

const generateOTP = () => Math.floor(10000 + Math.random() * 90000).toString();
// export const sendOtp = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     if (!identifier || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email or password missing'
//       });
//     }

//     // 1️⃣ Verify user
//     const user = await Users.findOne({ where: {  email: identifier, password } });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // 2️⃣ Read application setting
//     const setting = await ApplicationSetting.findOne();

//     // 3️⃣ OTP OFF → direct login (NO OTP)
//     if (!setting || setting.OtpVerification !== 1) {
//       return res.json({
//         success: true,
//         otpRequired: false,
//         message: 'OTP verification disabled'
//       });
//     }

//     // 4️⃣ OTP ON → generate OTP
//     const otp = generateOTP();

//     otpStore.set(identifier, otp);
//     setTimeout(() => otpStore.delete(identifier), 1 * 60 * 1000);

//     await transporter.sendMail({
//       from: process.env.EMAIL_ID,
//       to: identifier,
//       subject: 'Your OTP for Core Project',
//       text: `Hello ${user.name},\n\nYour OTP is: ${otp}\nDo not share it with anyone.`
//     });

//     return res.json({
//       success: true,
//       otpRequired: true,
//       message: 'OTP sent successfully'
//     });

//   } catch (err) {
//     console.error('Error sending OTP:', err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };


// export const sendOtp = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     if (!identifier || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Username/Email or password missing'
//       });
//     }

//     // ✅ Email OR Username se login
//     const user = await Users.findOne({
//       where: {
//         [Op.or]: [
//           { email: identifier },
//           { username: identifier }
//         ],
//         password
//       }
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid username/email or password'
//       });
//     }

//     // 2️⃣ Read application setting
//     const setting = await ApplicationSetting.findOne();

//     // 3️⃣ OTP OFF → direct login
//     if (!setting || setting.OtpVerification !== 1) {
//       return res.json({
//         success: true,
//         otpRequired: false,
//         message: 'OTP verification disabled'
//       });
//     }

//     // 4️⃣ OTP ON → generate OTP
//     const otp = generateOTP();

//     otpStore.set(user.email, otp); 
//     setTimeout(() => otpStore.delete(user.email), 1 * 60 * 1000);

//     await transporter.sendMail({
//       from: process.env.EMAIL_ID,
//       to: user.email,
//       subject: 'Your OTP for Core Project',
//       text: `Hello ${user.name},\n\nYour OTP is: ${otp}\nDo not share it with anyone.`
//     });

//     return res.json({
//       success: true,
//       otpRequired: true,
//       message: 'OTP sent successfully'
//     });

//   } catch (err) {
//     console.error('Error sending OTP:', err);
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

import bcrypt from 'bcrypt';

export const sendOtp = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email or password missing'
      });
    }

    // 1️⃣ Find user ONLY by email/username
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }

    // 2️⃣ Compare password
    let passwordMatch = false;

    // If password is hashed (new users after reset)
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      passwordMatch = false;
    }

    // If still false → try plain text match (old users)
    if (!passwordMatch) {
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password'
      });
    }

    // 3️⃣ Read application setting
    const setting = await ApplicationSetting.findOne();

    // 4️⃣ OTP OFF → Direct login
    if (!setting || setting.OtpVerification !== 1) {
      return res.json({
        success: true,
        otpRequired: false,
        message: 'OTP verification disabled'
      });
    }

    // 5️⃣ OTP ON → Generate OTP
    const otp = generateOTP();

    otpStore.set(user.email, otp);
    setTimeout(() => otpStore.delete(user.email), 1 * 60 * 1000);

    await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: user.email,
      subject: 'Your OTP for Core Project',
      text: `Hello ${user.name},\n\nYour OTP is: ${otp}\nDo not share it with anyone.`
    });

    return res.json({
      success: true,
      otpRequired: true,
      message: 'OTP sent successfully'
    });

  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email or OTP missing'
      });
    }

    // 🔍 find user by email OR username
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // 🔐 OTP always stored with EMAIL
    const storedOtp = otpStore.get(user.email);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    otpStore.delete(user.email);

    return res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// export const verifyOtp = async (req, res) => {
//     try {
//       const { identifier, otp } = req.body;
  
//       if (!identifier || !otp) {
//         return res.status(400).json({ success: false, message: 'Email or OTP missing' });
//       }
  
//       const storedOtp = otpStore.get(identifier);
//       if (!storedOtp || storedOtp !== otp) {
//         return res.status(401).json({ success: false, message: 'Invalid OTP' });
//       }
  
//       otpStore.delete(identifier); 
  
//       res.json({ success: true, message: 'OTP verified successfully' });
//     } catch (err) {
//       console.error('OTP verification error:', err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };
  // POST /auth/resend-otp
  export const resendOtp = async (req, res) => {
    try {
      const { identifier } = req.body;
  
      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: 'Username/Email missing'
        });
      }
  
      // 🔍 Find user by EMAIL OR USERNAME
      const user = await Users.findOne({
        where: {
          [Op.or]: [
            { email: identifier },
            { username: identifier }
          ]
        }
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/email'
        });
      }
  
      const otp = generateOTP();
  
      // 🔐 OTP always stored with EMAIL
      otpStore.set(user.email, otp);
      setTimeout(() => otpStore.delete(user.email), 5 * 60 * 1000);
  
      await transporter.sendMail({
        from: process.env.EMAIL_ID,
        to: user.email,
        subject: 'Your OTP for Core Project (Resend)',
        text: `Hello ${user.name},\n\nYour new OTP is: ${otp}\nDo not share it with anyone.`
      });
  
      return res.json({
        success: true,
        message: 'OTP resent successfully'
      });
  
    } catch (err) {
      console.error('Error resending OTP:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };
  

  // export const resendOtp = async (req, res) => {
  //   try {
  //     const { identifier  } = req.body;
  
  //     if (!identifier ) {
  //       return res.status(400).json({ success: false, message: 'Email missing' });
  //     }
  
  //     // Check if user exists
  //     const user = await Users.findOne({ where: { email:identifier  } });
  //     if (!user) {
  //       return res.status(401).json({ success: false, message: 'Invalid email' });
  //     }
  
  //     const otp = generateOTP();
  
  //     // Save new OTP in memory (expire after 5 min)
  //     otpStore.set(identifier , otp);
  //     setTimeout(() => otpStore.delete(identifier ), 5 * 60 * 1000);
  
  //     await transporter.sendMail({
  //       from: process.env.EMAIL_ID,
  //       to: identifier ,
  //       subject: 'Your OTP for Core Project (Resend)',
  //       text: `Hello ${user.name},\n\nYour new OTP is: ${otp}\nDo not share it with anyone.`
  //     });
  
  //     res.json({ success: true, message: 'OTP resent successfully'}); // testing only
  //   } catch (err) {
  //     console.error('Error resending OTP:', err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // };

  //application setting
  export const saveApplicationSetting = async (req, res) => {
    try {
      const data = req.body;
  
      let setting = await ApplicationSetting.findOne();
  
      if (setting) {
        await setting.update(data);
        return res.json({ success: true, message: 'Application setting updated', data: setting });
      } else {
        setting = await ApplicationSetting.create(data);
        return res.json({ success: true, message: 'Application setting created', data: setting });
      }
    } catch (err) {
      console.error('Error saving application setting:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  export const getApplicationSetting = async (req, res) => {
    try {
      const setting = await ApplicationSetting.findOne();
  
      if (!setting) {
        return res.status(404).json({ success: false, message: 'Application setting not found' });
      }
  
      res.json({ success: true, data: setting });
    } catch (err) {
      console.error('Error fetching application setting:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  