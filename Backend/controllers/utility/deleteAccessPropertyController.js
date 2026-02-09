

import { QueryTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';







export const deleteAccessPropertyDetails = async (req, res) => {
  const { OwnerID } = req.body;

  
  try {
  
    // Check if OwnerID is a string (comma-separated) or array
    const ownerIDs = typeof OwnerID === 'string'
      ? OwnerID.split(',').map((id) => id.trim()) 
      : Array.isArray(OwnerID)
      ? OwnerID
      : [];

    if (!ownerIDs.length) {
      return res.status(400).json({ error: 'OwnerID is required and cannot be empty' });
    }

    // Iterate over each OwnerID and call the stored procedure
    for (const id of ownerIDs) {
      console.log(`Processing OwnerID: ${id}`); // Debug log
      await sequelize.query('CALL prcDeleteEntryFromDatabase(:OwnerID)', {
        replacements: { OwnerID: id },
      });
    }

    res.status(200).json({ message: 'Entries deleted successfully' });
  } catch (error) {
    console.error('Error during deletion:', error.message, error.stack); // Log full error
    res.status(500).json({ error: 'An error occurred while deleting the entries' });
  }
};

// export const deleteAccessPropertyDetails = async (req, res) => {
//   try {
//     const { ownerId } = req.body;

//     if (!ownerId) {
//       return res.status(400).json({ success: false, message: 'OwnerID is required' });
//     }

//     // Call the stored procedure
//     await sequelize.query('CALL prcDeleteEntryFromDatabase(:ownerId)', {
//       replacements: { ownerId },
//       type: QueryTypes.RAW
//     });

//     return res.status(200).json({ success: true, message: `All data deleted for OwnerID ${ownerId}` });
//   } catch (error) {
//     console.error('Error deleting property data:', error);
//     return res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };