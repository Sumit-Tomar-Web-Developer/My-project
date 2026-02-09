// Adjust the import according to your project structure

import Users from '../../models/models/users.js';

export const getUsernames = async (req, res) => {
  console.log('getUsernames function called');
  try {
    const users = await Users.findAll({
      attributes: ['UserID', 'name'],
    });

    const usernames = users
      .filter((user) => user.name && user.name.trim() !== '')
      .map((user) => ({
        UserID: user.UserID,
        name: user.name,
      }));

    console.log('Usernames with IDs:', usernames);
    res.status(200).json({
      success: true,
      message: 'Usernames fetched successfully',
      data: usernames,
    });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching usernames.',
    });
  }
};

export const getUserInfoById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({
      attributes: ['UserID', 'name', 'AllocatedWard'],
      where: { UserID: id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data as an array
    res.status(200).json({
      user: [user],
      message: 'User Information fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user info.' });
  }
};

export const getUsersWithAllocatedWard = async (req, res) => {
  try {
    const usersList = await Users.findAll({
      attributes: ['UserID', 'name', 'AllocatedWard'],
    });

    // Return user data as an array
    res.status(200).json({
      users: [usersList],
      message: 'Users Information fetched successfully with AllocatedWards',
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching users information.' });
  }
};

export const saveOrUpdateAllocatedWards = async (req, res) => {
  try {
    const { UserID, AllocatedWard } = req.body;

    console.log('Received data:', req.body);

    // Check if required fields are provided
    if (!UserID || !AllocatedWard) {
      return res.status(400).json({
        message: 'Invalid data provided. id and AllocatedWard are required.',
      });
    }

    // Convert AllocatedWard to integers
    const allocatedWardIntegers = AllocatedWard.map(Number).filter(
      (ward) => !isNaN(ward)
    );

    // Find the user by ID
    const user = await Users.findOne({ where: { UserID } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get the previously allocated wards or an empty array if none exist
    const previousAllocatedWards = JSON.parse(user.AllocatedWard || '[]');

    let message = '';

    // If there are previously allocated wards, update them
    if (previousAllocatedWards.length > 0) {
      user.AllocatedWard = JSON.stringify(allocatedWardIntegers);
      message = `Allocated wards updated successfully.`;
    }
    // If no wards were previously allocated, assign the new ones
    else if (
      previousAllocatedWards.length === 0 &&
      allocatedWardIntegers.length > 0
    ) {
      user.AllocatedWard = JSON.stringify(allocatedWardIntegers);
      message = `New wards allocated successfully.`;
    }

    // Save the updated user
    await user.save();

    // Prepare the response object with updated data
    const updatedUserData = {
      UserID: user.UserID,
      name: user.name,
      AllocatedWard: allocatedWardIntegers, // Already in integer format
    };

    // Return the response with the updated user data and message
    return res.status(200).json({
      userData: [updatedUserData],
      message: message, // Include the update message in the response
    });
  } catch (error) {
    console.error('Error updating allocated wards:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
