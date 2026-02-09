import FloorMaster from '../../models/models/floormaster.js';
import OldFloorMaster from '../../models/models/oldfloormaster.js';
export const floorMaster = async (req, res) => {
  const { FMId, FloorID, Description ,UserID} = req.body;
  // Check if FloorID and Description are provided
  if (!FloorID || !Description) {
    return res.status(400).json({
      message: 'FloorID and Description are required',
    });
  }
  try {
    // Try to find an existing floor by FloorID
    let floor = await FloorMaster.findOne({
      where: { FMId },
    });
    if (!floor) {
      // If the floor does not exist, create a new one
      floor = await FloorMaster.create({
        FMId,
        FloorID,
        Description,
        CreatedBy: UserID,        

        CreatedDate: new Date()

      });
      // Respond with success message and the created floor details
      return res.status(200).json({
        message: 'Floor created successfully',
        floor,
      });
    } else {
      // Update the existing floor's description
      await floor.update({
        Description,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });
      // Respond with success message and the updated floor details
      return res.status(201).json({
        message: 'Floor updated successfully',
        floor,
      });
    }
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    return res.status(500).json({
      message: 'Failed to update/create floor',
      error: error.message,
    });
  }
};
//get table new Floor
export const fetchFloors = async (req, res) => {
  try {
    // Fetch all floors from the database
    const floorList = await FloorMaster.findAll();
    // Respond with the fetched floors
    res.status(200).json({
      message: 'Floors fetched successfully',
      floorList,
    });
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    res.status(500).json({
      message: 'Failed to fetch floors',
      error: error.message,
    });
  }
};
//delete
export const deleteFloorType = async (req, res) => {
  const { FMId } = req.body;
  if (!FMId) {
    return res.status(400).json({
      message: 'FMId is required',
    });
  }
  try {
    const floor = await FloorMaster.findOne({ where: { FMId } });
    if (!floor) {
      return res.status(404).json({
        message: 'Floor type not found',
      });
    }
    await FloorMaster.destroy({ where: { FMId } });
    res.status(200).json({
      message: 'Floor type deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete floor Id',
      error: error.message,
    });
  }
};
//insert floor descrpiti Old Floor
export const floorMasterOld = async (req, res) => {
  const { ID, OldFloorID, OldDescription,UserID } = req.body;
  if (!OldFloorID || !OldDescription) {
    return res.status(400).json({
      message: 'Old Floor and Description are required',
    });
  }
  try {
    // :small_blue_diamond: UPDATE
    if (ID && ID > 0) {
      const floor = await OldFloorMaster.findByPk(ID);
      if (!floor) {
        return res.status(404).json({
          message: 'Old Floor not found',
        });
      }
      await floor.update({ OldDescription });
      return res.status(200).json({
        message: 'Old Floor updated successfully',
        floor,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });
    }
    // :small_blue_diamond: DUPLICATE CHECK (INSERT)
    const existing = await OldFloorMaster.findOne({
      where: { OldFloorID },
    });
    if (existing) {
      return res.status(409).json({
        message: 'Duplicate Old Floor is not allowed',
      });
    }
    // :small_blue_diamond: INSERT
    const floor = await OldFloorMaster.create({
      OldFloorID,
      OldDescription,
      CreatedBy: UserID,        
      CreatedDate: new Date()
    });
    return res.status(201).json({
      message: 'Old Floor created successfully',
      floor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update/create old floor',
      error: error.message,
    });
  }
};
//get table Old Floor
export const oldfetchFloors = async (req, res) => {
  try {
    // Fetch all floors from the database
    const floors = await OldFloorMaster.findAll();
    // Respond with the fetched floors
    res.status(200).json({
      message: 'Old Floors fetched successfully',
      floors: floors,
    });
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    res.status(500).json({
      message: 'Failed to fetch floors',
      error: error.message,
    });
  }
};
//delete old
export const deleteOldType = async (req, res) => {
  const { ID } = req.query;
  if (!ID) {
    return res.status(400).json({
      message: 'ID is required',
    });
  }
  try {
    // Find the construction type by OldID
    const construction = await OldFloorMaster.findOne({
      where: { ID: ID },
    });
    if (!construction) {
      return res.status(404).json({
        message: 'Old Construction type not found',
      });
    }
    // Delete the construction type
    await OldFloorMaster.destroy({
      where: { ID: ID },
    });
    res.status(200).json({
      message: 'Old Construction type deleted successfully',
    });
  } catch (error) {
    console.error('Error during delete operation:', error);
    res.status(500).json({
      message: 'Failed to delete construction type',
      error: error.message,
    });
  }
};

