import ConstructionTypeMaster from '../../models/models/constructiontypemaster.js';
import oldConstructionTypeMaster from '../../models/models/oldconstructiontypemaster.js';


export const createConstructionType = async (req, res) => {
  const { CTMId, ConstructionId, Description,UserID } = req.body;

  if (!ConstructionId || !Description) {
    return res.status(400).json({
      message: 'ConstructionId and Description are required',
    });
  }

  try {
    // Try to find an existing construction by FloorID
    let construction = await ConstructionTypeMaster.findOne({
      where: { CTMId },
    });

    if (!construction) {
      // If the construction does not exist, create a new one
      construction = await ConstructionTypeMaster.create({
        CTMId,
        ConstructionId,
        Description,
        CreatedBy: UserID,        
        CreatedDate: new Date()
      });

      // Respond with success message and the created construction details
      return res.status(200).json({
        message: 'Construction created successfully',
        construction,
      });
    } else {
      // Update the existing construction's description
      await construction.update({
        Description,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });

      // Respond with success message and the updated construction details
      return res.status(201).json({
        message: 'Construction updated successfully',
        construction,
      });
    }
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    return res.status(500).json({
      message: 'Failed to update/create construction',
      error: error.message,
    });
  }
};

//get table new Floor
export const getAllConstructionTypes = async (req, res) => {
  try {
    // Retrieve all construction types
    const constructionTypes = await ConstructionTypeMaster.findAll();

    // Respond with the list of construction types
    res.status(200).json({
      message: 'Construction types fetched successfully',
      data: constructionTypes,
    });
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    res.status(500).json({
      message: 'Failed to fetch construction types',
      error: error.message,
    });
  }
};

//delete

export const deleteConstructionType = async (req, res) => {
  const { CTMId } = req.body;

  if (!CTMId) {
    return res.status(400).json({
      message: 'CTMId is required',
    });
  }

  try {
    const construction = await ConstructionTypeMaster.findOne({
      where: { CTMId },
    });

    if (!construction) {
      return res.status(404).json({
        message: 'Construction type not found',
      });
    }

    await ConstructionTypeMaster.destroy({
      where: { CTMId },
    });

    res.status(200).json({
      message: 'Construction type deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Can Not delete this construction type',
      error: error.message,
    });
  }
};



// Insert old construction  type


export const oldCreateConstructionType = async (req, res) => {
  const { OldID, OldConstructionId, OldDescription,UserID } = req.body;

  // Check if construction and description are provided
  if (!OldConstructionId || !OldDescription) {
    return res.status(400).json({
      message: 'Old Construction and Description are required',
    });
  }

  try {
    // Check if the construction already exists
    let construction = await oldConstructionTypeMaster.findOne({
      where: { OldID },
    });

    if (!construction) {
      // If the construction does not exist, create a new one
      construction = await oldConstructionTypeMaster.create({
        OldID,
        OldConstructionId,
        OldDescription,
        CreatedBy: UserID,        
        CreatedDate: new Date()
      });

      // Respond with success message and the created construction details
      return res.status(200).json({
        message: 'Old Floor created successfully',
        construction,
      });
    } else {
      // Update the existing construction's description
      await construction.update({
        OldDescription,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });

      // Respond with success message and the updated construction details
      return res.status(201).json({
        message: 'Old Floor updated successfully',
        construction,
      });
    }
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    res.status(500).json({
      message: 'Failed to update/create construction',
      error: error.message,
    });
  }
};



//get table old Floor
export const getAllConstructionTypesOld = async (req, res) => {
  try {
    // Retrieve all construction types
    const constructionTypes = await oldConstructionTypeMaster.findAll();

    // Respond with the list of construction types
    res.status(200).json({
      message: 'Construction types fetched successfully',
      data: constructionTypes,
    });
  } catch (error) {
    console.error(error);
    // Handle database or other errors
    res.status(500).json({
      message: 'Failed to fetch construction types',
      error: error.message,
    });
  }
};



//delete old
export const deleteOldConstructionType = async (req, res) => {
  const { OldID } = req.body;

  if (!OldID) {
    return res.status(400).json({
      message: 'Old ID is required',
    });
  }

  try {
    // Find the construction type by OldID
    const construction = await oldConstructionTypeMaster.findOne({
      where: { OldID: OldID },
    });

    if (!construction) {
      return res.status(404).json({
        message: 'Old Construction type not found',
      });
    }

    // Delete the construction type
    await oldConstructionTypeMaster.destroy({
      where: { OldID: OldID },
    });

    res.status(200).json({
      message: 'Old Construction type deleted successfully',
    });
  } catch (error) {
    console.error('Error during delete operation:', error);
    res.status(500).json({
      message: 'Can not this delete construction type',
      error: error.message,
    });
  }
};

