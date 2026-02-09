import SecurityLayerDetails from '../../../models/models/securitylayerdetails.js';
import SecurityLayerUserDetails from '../../../models/models/securitylayeruserdetails.js';
import UserAccessMaster from '../../../models/models/useraccessmaster.js';

export const getAccessLevels = async (req, res) => {
  try {
    const accessLevels = await UserAccessMaster.findAll({
      attributes: ['AccessID', 'AccessName'],
    });
    console.log(
      'Access levels from DB:',
      accessLevels.map((a) => a.toJSON())
    ); // Log data from DB
    return res.status(200).json(accessLevels);
  } catch (error) {
    console.error('Error fetching access levels:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch saved permissions for a specific layer
export const getSavedPermissions = async (req, res) => {
  const { layerID } = req.body;
  console.log(layerID, 'getSavedPermissions');
  try {
    const savedPermissions = await SecurityLayerDetails.findAll({
      attributes: ['PageID', 'AccessID'],
      where: { LayerID: layerID },
    });

    console.log(savedPermissions, 'getting permissions');
    return res.status(200).json(savedPermissions);
  } catch (error) {
    console.error('Error fetching saved permissions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const savePagePermissions = async (req, res) => {
  try {
    console.log(req.body, 'Received request body'); // Debugging

    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Invalid permissions data' });
    }

    await Promise.all(
      permissions.map(async ({ LayerID, PageID, AccessID }) => {
        const existingPermission = await SecurityLayerDetails.findOne({
          where: { LayerID, PageID },
        });

        if (existingPermission) {
          // Update the existing record
          await SecurityLayerDetails.update(
            { AccessID },
            { where: { LayerID, PageID } }
          );
        } else {
          // Insert new record if not found
          await SecurityLayerDetails.create({ LayerID, PageID, AccessID });
        }
      })
    );

    res.status(200).json({ message: 'Permissions saved successfully' });
  } catch (error) {
    console.error('Error saving permissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
