import ZoneMaster from '../../models/models/zonemaster.js';

// Fetch all zones

// export const zoneMaster = async (req, res) => {
//   const { ID, ZoneNo, ZoneType, Remark } = req.body;

//   if (!ZoneNo || !ZoneType) {
//     return res.status(400).json({
//       message: 'ZoneNo and ZoneType are required',
//     });
//   }

//   try {
//     if (ID) {
//       // Try to find an existing zone by ID
//       let zone = await ZoneMaster.findOne({ where: { ID } });

//       if (zone) {
//         // Update the existing zone's details
//         await zone.update({ ZoneNo, ZoneType, Remark });
//         return res.status(201).json({
//           message: 'Zone updated successfully',
//           zone,
//         });
//       } else {
//         // If the zone is not found, return 404 status
//         return res.status(203).json({
//           message: 'Zone not found',
//         });
//       }
//     } else {
//       // If ID is not provided, create a new zone
//       const zone = await ZoneMaster.create({ ZoneNo, ZoneType, Remark });
//       return res.status(200).json({
//         message: 'Zone created successfully',
//         zone,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Failed to update/create zone',
//       error: error.message,
//     });
//   }
// };

export const zoneMaster = async (req, res) => {
  const { ID, ZoneNo, ZoneType, Remark, UserID } = req.body;

  if (!ZoneNo || !ZoneType) {
    return res.status(400).json({
      message: 'ZoneNo and ZoneType are required',
    });
  }

  if (!UserID) {
    return res.status(400).json({
      message: 'UserID is required',
    });
  }

  try {
    if (ID) {
      // UPDATE
      const zone = await ZoneMaster.findOne({ where: { ID } });

      if (!zone) {
        return res.status(404).json({ message: 'Zone not found' });
      }

      await zone.update({
        ZoneNo,
        ZoneType,
        Remark,
        UpdatedBy: UserID,
        UpdatedDate: new Date(),
      });

      return res.status(200).json({
        message: 'Zone updated successfully',
        zone,
      });

    } else {
      // CREATE
      const zone = await ZoneMaster.create({
        ZoneNo,
        ZoneType,
        Remark,
        CreatedBy: UserID,
        CreatedDate: new Date(),
      });

      return res.status(200).json({
        message: 'Zone created successfully',
        zone,
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to create/update zone',
      error: error.message,
    });
  }
};


export const fetchZones = async (req, res) => {
  try {
    // Fetch all zones from the database
    const zoneList = await ZoneMaster.findAll();

    // Respond with the fetched zones
    res.status(200).json({
      message: 'Zones fetched successfully',
      zoneList,
    });
  } catch (error) {
    console.error(error);

    // Handle database or other errors
    res.status(500).json({
      message: 'Failed to fetch zones',
      error: error.message,
    });
  }
};

// Delete a zone
// export const deleteZone = async (req, res) => {
//   const { IDs } = req.body;  // Assuming you receive an array of IDs to delete

//   if (!Array.isArray(IDs) || !IDs.every(id => Number.isInteger(id) && id > 0)) {
//     return res.status(400).json({
//       message: 'IDs must be an array of positive integers'
//     });
//   }

//   const t = await sequelize.transaction();
//   try {
//     const zones = await ZoneMaster.findAll({
//       where: { ID: IDs },
//       transaction: t
//     });

//     if (zones.length === 0) {
//       await t.rollback();
//       return res.status(203).json({ message: 'Zone records not found' });
//     }

//     await ZoneMaster.destroy({
//       where: { ID: IDs },
//       transaction: t
//     });

//     await t.commit();
//     res.status(200).json({ message: 'Zone records deleted successfully' });
//   } catch (error) {
//     await t.rollback();
//     console.error('Error deleting Zone records:', error);
//     res.status(500).json({
//       error: 'An error occurred while deleting Zone records.',
//     });
//   }
// };

// export const deleteZone = async (req, res) => {
//   try {
//     const { IDs } = req.body;

//     if (!Array.isArray(IDs) || !IDs.every(id => Number.isInteger(id) && id > 0)) {
//       return res.status(400).json({ message: 'IDs must be an array of positive integers' });
//     }

//     const t = await sequelize.transaction();
//     try {
//       const zones = await ZoneMaster.findAll({ where: { ID: IDs }, transaction: t });

//       if (zones.length === 0) {
//         await t.rollback();
//         return res.status(404).json({ message: 'Zone records not found' });
//       }

//       await ZoneMaster.destroy({ where: { ID: IDs }, transaction: t });

//       await t.commit();
//       return res.status(200).json({ message: 'Zone records deleted successfully' });
//     } catch (error) {
//       await t.rollback();
//       console.error('Error deleting Zone records:', error);
//       return res.status(500).json({ message: 'An error occurred while deleting Zone records.' });
//     }
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ message: 'Unexpected error occurred.' });
//   }

// };
export const deleteZone = async (req, res) => {
  const { IDs } = req.body;

  if (!IDs || !Array.isArray(IDs) || IDs.length === 0) {
    return res.status(400).json({
      message: 'IDs are required and must be a non-empty array',
    });
  }

  try {
    // Delete multiple zones by their IDs
    await ZoneMaster.destroy({
      where: {
        ID: IDs,
      },
    });

    return res.status(200).json({
      message: 'Zones deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to delete zones',
      error: error.message,
    });
  }
};
