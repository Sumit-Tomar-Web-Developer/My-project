import AdminUser from '../../models/auth/users.js';
import SecurityLayer from '../../models/models/securitylayer.js';
import SecurityLayerDetails from '../../models/models/securitylayerdetails.js';
import SecurityLayerUserDetails from '../../models/models/securitylayeruserdetails.js';
import { SENDMAIL } from '../../utils/emailOtp.js';

import { generatePassword } from '../../utils/passwordUtils.js';
import bcrypt from 'bcrypt';


export const getUsers = async (req, res) => {
  try {
    const users = await AdminUser.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      error: 'An error occurred while getting users.',
    });
  }
};

export const addUserAdmin = async (req, res) => {
  const {
    UserID,
    role,
    name,
    email,
    username,
    active,
    dob,
    address,
    contact_no,
    userlevel,
  } = req.body;

  try {
    // Find LayerID based on LayerName
    const layer = await SecurityLayer.findOne({
      where: { LayerName: userlevel },
    });

    if (!layer) {
      return res.status(400).json({ message: 'Invalid user level' });
    }

    let formattedDob = null;
    if (dob) {
      formattedDob = new Date(dob).toISOString().split('T')[0];
    }

    if (UserID === 0) {
      // Create a new admin user
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
      const adminUser = await AdminUser.create({
        role,
        name,
        email,
        username,
        active,
        dob: formattedDob,
        address,
        contact_no,
        isfirstlogin: true,
        password: hashedPassword, // Store hashed password
        userlevel,
      });

      // Save LayerID in securitylayeruserdetails
      await SecurityLayerUserDetails.create({
        LayerID: layer.LayerID,
        UserID: adminUser.UserID,
      });

      // Send email with auto-generated password
      const message = `Welcome to our platform! Your auto-generated password is: ${password}`;
      console.log('Sending email to:', email);
      console.log('Email body:\n', message);
      const options = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: 'Welcome to Our Platform - Auto-generated Password',
        text: message,
      };

      await SENDMAIL(options);

      return res.status(200).json({
        message: 'Admin user created successfully',
        adminUser: { ...adminUser.get(), dob: formattedDob },
        LayerID: layer.LayerID,
      });
    } else {
      // Check if the user exists before updating
      const existingUser = await AdminUser.findByPk(UserID);
      if (!existingUser) {
        return res.status(404).json({ message: 'Admin user not found' });
      }

      // Update existing user
      await AdminUser.update(
        {
          role,
          name,
          email,
          username,
          active,
          dob: formattedDob,
          address,
          contact_no,
          userlevel,
        },
        { where: { UserID } }
      );

      // Update LayerID in securitylayeruserdetails
      await SecurityLayerUserDetails.update(
        { LayerID: layer.LayerID },
        { where: { UserID } }
      );

      // Fetch the updated user data
      const updatedUser = await AdminUser.findByPk(UserID, { raw: true });

      return res.status(201).json({
        message: 'Admin user updated successfully',
        adminUser: { ...updatedUser, dob: formattedDob },
        LayerID: layer.LayerID,
      });
    }
  } catch (error) {
    console.error('Error in admin user operation:', error);
    res.status(500).json({
      error: 'An error occurred while processing the admin user request.',
    });
  }
};
