import SecurityLayer from '../../../models/models/securitylayer.js';

export const getSecurityLayer = async (req, res) => {
  try {
    const result = await SecurityLayer.findAll();

    return res.status(200).json({
      message: 'Security Layer Fetched Successfully',
      LayerData: result,
    });
  } catch (error) {
    console.error('Error fetching security layer:', error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const AddOrUpdateSecurityLayer = async (req, res) => {
  try {
    const { LayerObject } = req.body;

    console.log('Adding or updating', LayerObject);

    if (LayerObject.LayerID && LayerObject.LayerID !== 0) {
      // Update existing record
      const [updatedCount] = await SecurityLayer.update(LayerObject, {
        where: { LayerID: LayerObject.LayerID },
      });

      if (updatedCount > 0) {
        // Fetch the updated record
        const updatedLayer = await SecurityLayer.findOne({
          where: { LayerID: LayerObject.LayerID },
        });

        return res.status(201).json({
          message: 'Layer updated successfully.',
          layerData: updatedLayer,
        });
      } else {
        return res.status(400).json({ message: 'Layer update failed.' });
      }
    } else {
      // Insert new record when LayerID is 0
      const newLayer = await SecurityLayer.create({
        LayerName: LayerObject.LayerName,
        Status: LayerObject.Status,
      });

      if (newLayer) {
        return res.status(200).json({
          message: 'Layer added successfully.',
          layerData: newLayer,
        });
      } else {
        return res.status(400).json({ message: 'Layer not added.' });
      }
    }
  } catch (error) {
    console.error('Error adding/updating security layer:', error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const DeleteSecurityLayer = async (req, res) => {
  try {
    const { LayerID } = req.body;
    const deletedRecord = await SecurityLayer.destroy({ where: { LayerID } });
    if (deletedRecord) {
      return res.status(200).json({ message: 'Layer deleted successfully.' });
    } else {
      return res.status(404).json({ message: 'Layer not found.' });
    }
  } catch (error) {
    console.error('Error deleting security layer:', error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};
