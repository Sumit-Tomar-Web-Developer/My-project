import AdminUser from '../../models/auth/users.js';
import LoginDetails from '../../models/models/logindetails.js';
import SecurityLayer from '../../models/models/securitylayer.js';
import generateToken from '../../utils/tokenUtils.js';


import { Op } from 'sequelize';

import bcrypt from 'bcrypt';
import { sendResetLink } from '../../utils/emailOtp.js';

// export let GlobalUserID = 0;


export const resetPassword = async (req, res) => {
  const { identifier, newPassword } = req.body;

  try {
    const user = await AdminUser.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔐 ALWAYS HASH RESET PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isfirstlogin = false;
    await user.save();

    const token = generateToken(user.UserID);

    return res.status(200).json({
      message: 'Password reset successful',
      token
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await AdminUser.findOne({
      where: {
        email
      }
    });

    // Always return success (security best practice)
    if (!user) {
      return res.status(200).json({
        message: 'If this email exists, a reset link has been sent'
      });
    }

    // generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendResetLink(user.email, resetLink);

    return res.status(200).json({
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("Logging out user with ID:", userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // Find the latest login record for this user where LogoutTime is null
    const lastLogin = await LoginDetails.findOne({
      where: {
        UserID: userId,
        LogOutTime: null
      },
      order: [['LoginDateTime', 'DESC']]
    });

    if (!lastLogin) {
      console.log("⚠️ No active login record found to update.");
      return res.status(404).json({ message: "No active login session found" });
    }

    // Update logout time
    lastLogin.LogOutTime = new Date();
    await lastLogin.save();

    console.log(`✅ User ${userId} logged out at ${lastLogin.LogOutTime}`);
    return res.status(200).json({ message: "Logout successful", logoutTime: lastLogin.LogOutTime });
  } catch (err) {
    console.error("🔥 Error in logoutUser:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const login = async (req, res) => {
  const { identifier, password } = req.body;

  console.log("➡️ LOGIN REQUEST RECEIVED");
  console.log("Identifier:", identifier);
  console.log("Password entered:", password);

  try {
    if (!identifier || !password) {
      console.log("❌ Missing credentials");
      return res
        .status(400)
        .json({ error: "Username or Email and password are required" });
    }

    // 🔍 Find user
    console.log("🔎 Searching user in database...");

    const user = await AdminUser.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      console.log("❌ User NOT found");
      return res.status(203).json({ error: "User not found" });
    }
    // GlobalUserID = user.UserID
    console.log("✅ User found:", {
      UserID: user.UserID,
      email: user.email,
      username: user.username,
      userlevel: user.userlevel,
      isfirstlogin: user.isfirstlogin,
    });

    const storedPassword = user.password;
    console.log("Stored Password (HASH or PLAIN):", storedPassword);

    let passwordMatch = false;

    // 1️⃣ If password looks like bcrypt hash ($2...)
    if (storedPassword && storedPassword.startsWith("$2")) {
      console.log("🔐 Detected bcrypt hash — comparing...");
      passwordMatch = await bcrypt.compare(password, storedPassword);
    }
    // 2️⃣ Legacy plain-text password
    else {
      console.log("📎 Detected legacy plain-text password — comparing...");
      passwordMatch = password === storedPassword;

      // If matched → upgrade to bcrypt
      if (passwordMatch) {
        console.log("🔄 Upgrading legacy password → bcrypt hashing...");
        const newHash = await bcrypt.hash(password, 10);
        user.password = newHash;
        await user.save();
        console.log("✅ Password upgraded & saved");
      }
    }

    if (!passwordMatch) {
      console.log("❌ PASSWORD INVALID");
      return res.status(403).json({ error: "Incorrect password" });
    }

    console.log("✅ PASSWORD MATCHED");

    // 🎟 Generate token
    const token = generateToken(user.UserID);

    // 🔍 Layer details
    const layer = await SecurityLayer.findOne({
      where: { LayerName: user.userlevel },
    });

    const LayerID = layer ? layer.LayerID : null;

    // 📝 Log login
    const loginRecord = await LoginDetails.create({
      UserID: user.UserID,
      LoginDateTime: new Date(),
      LogOutTime: null,
    });

    console.log("🎉 LOGIN SUCCESSFUL — Sending Response");

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        UserID: user.UserID,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        contact_no: user.contact_no,
        address: user.address,
        dob: user.dob,
        active: user.active,
        userlevel: user.userlevel,
        isfirstlogin: user.isfirstlogin,
        LayerID,
      },
      loginId: loginRecord.ID,
    });
  } catch (error) {
    console.error("💥 LOGIN ERROR:", error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};





export const getUserLoginHistory = async (req, res) => {
  try {
    const { UserID, StartDate, EndDate } = req.body;

    if (!UserID) {
      return res.status(400).json({ message: "⚠️ UserID is required" });
    }

    const whereClause = { UserID };

    if (StartDate && EndDate) {
      // Cover the entire end day until 23:59:59
      const start = new Date(`${StartDate} 00:00:00`);
      const end = new Date(`${EndDate} 23:59:59`);

      whereClause.LoginDateTime = {
        [Op.between]: [start, end],
      };
    }

    console.log("📋 Fetching login/logout history:", whereClause);

    // 🧩 Fetch login/logout records
    const logs = await LoginDetails.findAll({
      where: whereClause,
      order: [["LoginDateTime", "DESC"]],
      raw: true
    });

    if (!logs.length) {
      return res.status(404).json({ message: "❌ No login/logout records found" });
    }

    // 🧩 Fetch user info from AdminUser table
    const user = await AdminUser.findOne({
      where: { UserID },
      attributes: [
        "UserID",

        "name",

      ],
      raw: true
    });

    // 🧮 Calculate durations for each session
    const formattedLogs = logs.map((log) => {
      const loginTime = log.LoginDateTime ? new Date(log.LoginDateTime) : null;
      const logoutTime = log.LogOutTime ? new Date(log.LogOutTime) : null;

      let totalMinutes = 0;
      if (loginTime && logoutTime) {
        totalMinutes = Math.round((logoutTime - loginTime) / (1000 * 60));
      }

      return {
        ...log,
        LoginDateTime: loginTime ? loginTime.toLocaleString() : "-",
        LogOutTime: logoutTime ? logoutTime.toLocaleString() : "-",
        SessionDuration:
          totalMinutes > 0
            ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
            : "-",
      };
    });

    // 🧮 Sum all session durations for total time
    const totalMinutesAll = formattedLogs.reduce((sum, r) => {
      const match = r.SessionDuration.match(/(\d+)h (\d+)m/);
      if (match) {
        sum += parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      return sum;
    }, 0);

    const summary = {
      UserID: user?.UserID || UserID,
      Name: user?.name || "Unknown",
      TotalSessions: formattedLogs.length,
      TotalTimeSpent: `${Math.floor(totalMinutesAll / 60)}h ${totalMinutesAll % 60}m`,
      FromDate: StartDate || "-",
      ToDate: EndDate || "-",
    };

    return res.status(200).json({
      summary,
      sessions: formattedLogs
    });
  } catch (error) {
    console.error("🔥 Error fetching login/logout history:", error);
    res.status(500).json({
      message: "Server error fetching login/logout history",
      error: error.message
    });
  }
};



